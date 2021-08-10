import { Model, ObjectID, Ref, Schema } from "@tsed/mongoose";
import { Default, Enum, Groups, Property } from "@tsed/schema";
import { User } from "../users/User";

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Model({ schemaOptions: { timestamps: true } })
export class Permission {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  moduleName: string;

  @Enum(Roles)
  @Default("admin")
  roleName: string;

  @Property()
  readAttributes?: string[];

  @Property()
  updateAttributes?: string[];

  @Property()
  create?: boolean = true;

  @Property()
  read?: boolean = true;

  @Property()
  update?: boolean = true;

  @Property()
  delete?: boolean = true;

  @Ref(User)
  createdBy?: Ref<User>;
}
