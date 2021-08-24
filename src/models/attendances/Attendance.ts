import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Format,
  Groups,
  Property,
  Required,
} from "@tsed/schema";
import { Grade } from "../grades/Grades";
import { Section } from "../sections/Section";
import { Student } from "../users/Student";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Attendance {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(Student)
  @Required()
  student: Ref<Student>;

  @Ref(Grade)
  @Required()
  grade: Ref<Grade>;

  @Ref(Section)
  @Required()
  section: Ref<Section>;

  @Property()
  text: string;

  @Format("date-time")
  @Default(Date.now)
  date: Date = new Date();

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;
}
