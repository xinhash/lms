import { Indexed, Model, ObjectID, Trim, Unique } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Format,
  Groups,
  MaxLength,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { Package } from "../packages/Package";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class School {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Required()
  @MinLength(3)
  @MaxLength(100)
  @Trim()
  name: string;

  @Indexed()
  @Required()
  @Format("hostname")
  @Unique()
  domain: string;

  @Property()
  @Required()
  address: string; // use inline model

  @Enum("multi", "single")
  @Default("single")
  branch: string;

  @Property()
  @Default(false)
  isMainBranch: boolean;

  @Property()
  @Required()
  packagedId: Package;

  @Property()
  @Required()
  createdBy: User;

  @Enum("active", "inactive", "suspended", "blocked")
  @Default("active")
  status: string;
}
