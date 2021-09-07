import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Example,
  Format,
  Groups,
  MaxLength,
  Minimum,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Package {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  @Example("Package 1")
  name: string;

  @Property()
  @Enum("monthly", "yearly")
  @Default("yearly")
  plan: string;

  @Property()
  @Required()
  @Trim()
  @Example("Sample package description")
  description: string;

  @Property()
  @Required()
  @Trim()
  @Example("Sample package terma")
  terms: string;

  @Minimum(0)
  @Default(0)
  @Example("1000")
  amount: number = 0;

  @Format("date")
  @Required()
  dueDate: Date;

  @Format("date")
  @Required()
  billDate: Date;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;
}
