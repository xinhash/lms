import { Model, ObjectID, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Groups,
  MaxLength,
  Minimum,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";

@Model({ schemaOptions: { timestamps: true } })
export class Package {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Property()
  @Enum("monthly", "yearly")
  @Default("yearly")
  plan: string;

  @Property()
  @Required()
  @Trim()
  description: string;

  @Property()
  @Required()
  @Trim()
  terms: string;

  @Minimum(0)
  @Default(0)
  amount: number = 0;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;
}
