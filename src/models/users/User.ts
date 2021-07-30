import {
  Indexed,
  Model,
  ObjectID,
  PreHook,
  Trim,
  Unique,
} from "@tsed/mongoose";
import {
  Default,
  Email,
  Enum,
  Groups,
  Ignore,
  MaxLength,
  MinLength,
  Optional,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";
import { argon2i } from "argon2-ffi";
import crypto from "crypto";
import util from "util";

enum Roles {
  ADMIN = "admin",
  SCHOOL = "school",
  STUDENT = "student",
}

const getRandomBytes = util.promisify(crypto.randomBytes);

@Model({ schemaOptions: { timestamps: true } })
@PreHook("save", async (user: User, next: any) => {
  const salt = await getRandomBytes(32);
  user.password = await argon2i.hash(user.password, salt);
  next();
})
export class User {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  username: string;

  @Property()
  @Indexed()
  @Required()
  @Email()
  @Unique()
  @Trim()
  email: string;

  @Property()
  @Required()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Enum(Roles)
  @Default("student")
  role: Roles;

  @Property()
  @Optional()
  @Default(true)
  isActive: boolean;

  @Property()
  @Optional()
  @Default(true)
  isVerified: boolean;

  token: string;

  public async verifyPassword(pwd: string): Promise<boolean> {
    const password = Buffer.from(pwd);
    const isCorrect = await argon2i.verify(this.password, password);
    return isCorrect;
  }
}
