import {
  Indexed,
  Model,
  ObjectID,
  PreHook,
  Ref,
  Schema,
  Trim,
  Unique,
} from "@tsed/mongoose";
import {
  Default,
  Enum,
  Format,
  Groups,
  MaxLength,
  MinLength,
  Optional,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";
import { tenYearsAgo } from "src/utils";
import { Package } from "../packages/Package";
import { Address } from "../users/Address";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
@PreHook("save", async (school: School, next: any) => {
  if(!school.startedAt) {
    school.startedAt = tenYearsAgo()
  }
  next();
})
export class School {
  @Groups("!creation")
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
  @Pattern(/^[6-9]\d{9}$/)
  phoneNumber: number;

  @Enum("multi", "single")
  @Default("single")
  branch: string;

  @Property()
  @Default(false)
  isMainBranch: boolean;

  @Ref(() => School)
  mainBranch: Ref<School>;

  @Ref(Package)
  @Required()
  package: Ref<Package>;

  @Ref(User)
  createdBy?: Ref<User>;

  adminId?: string

  @Enum("active", "inactive", "suspended", "blocked")
  @Default("active")
  status: string;

  @Required()
  @Format("date")
  startedAt: Date;
}
