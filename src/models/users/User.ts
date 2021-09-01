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
  Example,
  Format,
  Groups,
  MaxLength,
  MinLength,
  Nullable,
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

  @Pattern(/^[6-9]{1}[0-9]{9}$/)
  @Example(9899999999)
  phoneNumber?: number;

  @Nullable(Date)
  @Format("date")
  dateOfBirth?: Date | null;

  currentAddress?: Address;

  permanentAddress?: Address;

  @Required()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Enum(Roles)
  @Default("admin")
  role: string;

  @Ref(Role)
  @Groups("!creation", "!updation")
  roleId?: Ref<Role>;

  @Groups("updation")
  @Default(true)
  isActive?: boolean;

  @Groups("updation")
  @Default(true)
  isVerified: boolean;

  fatherName?: string;

  motherName?: string;

  socialMediaAccount?: SocialMediaAccount;

  photo?: string;

  @Enum("male", "female")
  @Default("male")
  gender?: string;

  @Ref(() => User)
  @Groups("!creation", "!updation")
  createdBy: Ref<User>;

  @Ref(() => User)
  @Groups("!creation", "!updation")
  adminId: Ref<User>;

  token: string;

  public async verifyPassword(pwd: string): Promise<boolean> {
    const password = Buffer.from(pwd);
    const isCorrect = await argon2i.verify(this.password, password);
    return isCorrect;
  }
}
