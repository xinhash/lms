import {
  Indexed,
  Model,
  ObjectID,
  PostHook,
  PreHook,
  Ref,
  Schema,
  Trim,
  Unique,
} from "@tsed/mongoose";
import {
  Default,
  Enum,
  Example,
  Format,
  Groups,
  MaxLength,
  MinLength,
  Optional,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";
import { generateSessions, tenYearsAgo } from "src/utils";
import { Package } from "../packages/Package";
import { Address } from "../users/Address";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
@PreHook("save", async (school: School, next: any) => {
  if(!school.startedAt) {
    school.startedAt = tenYearsAgo()
  }
  if(school.isMainBranch) {
    school.mainBranch = school._id
  }
  next();
})
export class School {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Required()
  @MinLength(3)
  @MaxLength(100)
  @Trim()
  name: string;

  @Indexed()
  @Required()
  @Format("hostname")
  @Unique()
  domain: string;

  @Property()
  @Required()
  address: Address;

  @Property()
  @Required()
  @Pattern(/^[6-9]{1}[0-9]{9}$/)
  @Example(9899999999)
  phoneNumber: number;

  @Enum("multi", "single")
  @Default("single")
  branch: string;

  @Property()
  @Default(false)
  isMainBranch: boolean;

  @Ref(() => School)
  mainBranch?: Ref<School>;

  @Ref(Package)
  @Required()
  package: Ref<Package>;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;

  adminId?: string

  @Enum("active", "inactive", "suspended", "blocked")
  @Default("active")
  status: string;

  @Required()
  @Format("date")
  startedAt: Date;
}
