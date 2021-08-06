import { Model, ObjectID, Trim } from "@tsed/mongoose";
import {
  CollectionOf,
  Default,
  Enum,
  Groups,
  MaxLength,
  Minimum,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { Course } from "../courses/Course";
import { Section } from "../sections/Section";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Class {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Property(() => Course)
  @Required()
  courseId: string;

  @CollectionOf(Section)
  sectionIds: Section[];

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Property()
  @Required()
  createdBy: User;
}
