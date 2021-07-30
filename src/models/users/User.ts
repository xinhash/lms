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
  @Required()
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

  @Groups("creation")
  @Property()
  @Required()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Property()
  @Optional()
  @Default(true)
  isActive: boolean;

  @Property()
  @Optional()
  @Default(true)
  isVerified: boolean;
}
