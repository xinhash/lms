import { Model, Ref, Schema } from "@tsed/mongoose";
import { Default, Enum, Format, Required } from "@tsed/schema";
import { User } from "./User";

enum StaffRoles {
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
  accountNumber: number;

  @Required()
  ifscCode: number;

  @Required()
  name: string;

  @Required()
  branch: number;
}

@Model({ schemaOptions: { timestamps: true } })
export class Staff {
  @Ref(User)
  @Required()
  user: Ref<User>;

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
  workExperience: number;

  @Required()
  epfNo: number;

  @Required()
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
