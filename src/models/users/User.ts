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
  Format,
  Groups,
  MaxLength,
  MinLength,
  Optional,
  Pattern,
  Required,
} from "@tsed/schema";
import { argon2i } from "argon2-ffi";
import crypto from "crypto";
import util from "util";
import { Address } from "./Address";
import { Role } from "./Role";
import { SocialMediaAccount } from "./SocialMediaAccount";
import { StaffRoles } from "./Staff";

const getRandomBytes = util.promisify(crypto.randomBytes);

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  STUDENT = "student",
  STAFF = "staff"
}

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
  @Groups("!creation", "!updation")
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

  @Optional()
  @Required()
  @Pattern(/^[6-9]\d{9}$/)
  phoneNumber: number;

  @Optional()
  @Format("date")
  @Required()
  dateOfBirth: Date;

  @Optional()
  currentAddress: Address;

  @Optional()
  permanentAddress: Address;

  @Required()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Enum(Roles)
  @Default("admin")
  role: string;

  @Optional()
  @Ref(Role)
  roleId: Ref<Role>;

  @Optional()
  @Default(true)
  isActive?: boolean;

  @Optional()
  @Default(true)
  isVerified: boolean;

  @Optional()
  fatherName: string;

  @Optional()
  motherName: string;

  @Optional()
  socialMediaAccount: SocialMediaAccount;

  @Optional()
  photo: string;

  @Enum("male", "female")
  @Optional()
  @Default("male")
  gender: string;

  @Ref(() => User)
  @Groups("!updation")
  createdBy: Ref<User>;

  @Ref(() => User)
  @Groups("!updation")
  adminId: Ref<User>;

  token: string;

  public async verifyPassword(pwd: string): Promise<boolean> {
    const password = Buffer.from(pwd);
    const isCorrect = await argon2i.verify(this.password, password);
    return isCorrect;
  }
}
