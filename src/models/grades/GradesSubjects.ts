import { Model, ObjectID, Ref, Trim, Unique } from "@tsed/mongoose";
import { Enum, Groups, Required } from "@tsed/schema";
import { Subject } from "../subjects/Subject";
import { User } from "../users/User";
import { Grade } from "./Grades";

@Model({ schemaOptions: { timestamps: true } })
export class GradeSubject {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => Grade)
  @Required()
  grade: Ref<Grade>;

  @Ref(() => Subject)
  @Required()
  subject: Ref<Subject>;

  @Enum("Language", "Mains", "Mains with Science", "Additional Subject")
  @Required()
  format: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
