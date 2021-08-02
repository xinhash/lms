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
import { Medium } from "../mediums/Medium";

@Model({ schemaOptions: { timestamps: true } })
export class Section {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Property(() => Medium)
  @Required()
  mediumId: string;

  @Minimum(0)
  @Default(0)
  noOfStudents: number = 0;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;
}
