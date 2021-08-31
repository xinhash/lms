import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
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
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Section {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Ref(() => Medium)
  @Required()
  mediumId: Ref<Medium>;

  @Minimum(0)
  @Default(0)
  noOfStudents: number = 0;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy?: Ref<User>;
}
