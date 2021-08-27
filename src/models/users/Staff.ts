import { Model, Ref, Schema } from "@tsed/mongoose";
import { Default, Enum, Format, Integer, Max, Min, Optional, Pattern, Required } from "@tsed/schema";
import { User } from "./User";

export enum StaffRoles {
  ACCOUNTANT = "accountant",
  TEACHER = "teacher",
  LIBRARIAN = "librarian",
  RECEPTIONIST = "receptionist",
}

enum MaritalStatus {
  MARRIED = "married",
  UNMARRIED = "unmarried",
}

enum ContractType {
  PERMANENT = "permanent",
  PROBATION = "probation",
}

@Schema()
class BankDetails {
  @Required()
  @Integer()
  accountNumber: number;

  @Required()
  ifscCode: string;

  @Required()
  name: string;

  @Required()
  branch: number;
}

@Model({ schemaOptions: { timestamps: true } })
export class Staff {
  @Ref(User)
  @Optional()
  user?: Ref<User>;

  @Enum(StaffRoles)
  @Required()
  role: string;

  @Required()
  designation: string;

  @Required()
  department: string;

  @Format("date")
  @Required()
  dateOfJoining: Date;

  @Enum(MaritalStatus)
  @Required()
  maritalStatus: string;

  @Required()
  qualifications: string[];

  @Required()
  @Max(50)
  @Min(0)
  @Integer()
  workExperience: number;

  @Required()
  epfNo: number;

  @Required()
  @Integer()
  @Min(0)
  basicSalary: number;

  @Required()
  bank: BankDetails;

  @Enum(ContractType)
  @Required()
  contactType: string;

  @Required()
  workShift: string;

  @Required()
  resume: string;

  @Required()
  joiningLetter: string;

  @Required()
  otherDocuments: string[];

  @Enum("active", "inactive", "suspended")
  @Default("active")
  status: string;
}
