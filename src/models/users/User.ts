import {
  Indexed,
  Model,
  ObjectID,
  PreHook,
  Ref,
  Trim,
  Unique,
} from "@tsed/mongoose";
import {
  Default,
  Email,
  Enum,
  Groups,
  MaxLength,
  MinLength,
  Optional,
  Required,
} from "@tsed/schema";
import { argon2i } from "argon2-ffi";
import crypto from "crypto";
import util from "util";

const getRandomBytes = util.promisify(crypto.randomBytes);

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Groups<User>({
  // will generate UserCreate
  create: ["username", "email", "password", "role", "isActive", "isVerified"],
  // will generate UserUpdate
  update: ["_id", "username", "email", "role", "isActive", "isVerified"],
  // will generate UserChangePassword
  changePassword: ["_id", "password"],
})
@Model({ schemaOptions: { timestamps: true } })
@PreHook("save", async (user: User, next: any) => {
  const salt = await getRandomBytes(32);
  user.password = await argon2i.hash(user.password, salt);
  if (user.role === "superadmin") {
    user.adminId = user._id;
  }
  next();
})
export class User {
  @ObjectID("id")
  _id: string;

  @MinLength(3)
  @MaxLength(50)
  @Trim()
  username: string;

  @Indexed()
  @Required()
  @Email()
  @Unique()
  @Trim()
  email: string;

  @Required()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  // @Ref(Role)
  // @Required()
  // role: Ref<Role>;

  @Enum(Roles)
  @Default("admin")
  role: string;

  @Optional()
  @Default(true)
  isActive?: boolean;

  @Optional()
  @Default(true)
  isVerified?: boolean;

  @Enum("male", "female")
  @Optional()
  @Default("male")
  gender?: string;

  @Ref(() => User)
  createdBy: Ref<User>;

  @Ref(() => User)
  adminId: Ref<User>;

  token: string;

  public async verifyPassword(pwd: string): Promise<boolean> {
    const password = Buffer.from(pwd);
    const isCorrect = await argon2i.verify(this.password, password);
    return isCorrect;
  }
}
