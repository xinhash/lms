import { Model, ObjectID, Ref, Trim, Unique } from "@tsed/mongoose";
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
import { Subject } from "../subjects/Subject";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Grade {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Unique()
  @Required()
  @MinLength(1)
  @MaxLength(50)
  @Trim()
  name: string;

  @Ref(() => Course)
  @Required()
  course: Ref<Course>;

  @Groups("!creation")
  @Ref(() => Section)
  @CollectionOf(() => Section)
  sections?: Ref<Section>[];

  @Groups("!creation")
  @Ref(() => Subject)
  @CollectionOf(() => Subject)
  subjects?: Ref<Subject>[];

  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
