import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  CollectionOf,
  Default,
  Enum,
  Groups,
  MaxLength,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { Course } from "../courses/Course";
import { Section } from "../sections/Section";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Grade {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Ref(Course)
  @Required()
  courseId: Ref<Course>;

  @Ref(() => Section)
  @CollectionOf(() => Section)
  sectionIds: Ref<Section>[];

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  createdBy: Ref<User>;
}
