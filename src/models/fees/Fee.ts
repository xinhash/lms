import { Model, ObjectID, Ref, Schema, Trim } from "@tsed/mongoose";
import { Default, Enum, Groups, Property, Required } from "@tsed/schema";
import { Grade } from "../grades/Grades";
import { Medium } from "../mediums/Medium";
import { School } from "../schools/School";
import { User } from "../users/User";

@Schema()
class FeeData {
  @Property()
  feeHeaderId: number;

  @Property()
  oldStudentFee: number;

  @Property()
  newStudentFee: number;
}

@Model({ schemaOptions: { timestamps: true } })
export class Fee {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(School)
  @Required()
  school: Ref<School>;

  @Ref(Grade)
  @Required()
  grade: Ref<Grade>;

  @Ref(Medium)
  @Required()
  medium: Ref<Medium>;

  @Property()
  @Required()
  info: FeeData;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;
}
