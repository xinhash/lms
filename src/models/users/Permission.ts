import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Default, Enum, Groups, Optional, Property } from "@tsed/schema";
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

  @Ref(User)
  userId?: Ref<User>;

  @Property()
  moduleName: string;

  @Enum(Roles)
  @Default("admin")
  roleName: string;

  @Property()
  readIds: string[] = [];

  @Property()
  updateIds: string[] = [];

  @Property()
  deleteIds: string[] = [];

  @Property()
  readAttributes?: string[] = [];

  @Property()
  updateAttributes?: string[] = [];

  @Optional()
  @Default(false)
  canCreate: boolean = false;

  @Optional()
  @Default(true)
  canRead: boolean = true;

  @Optional()
  @Default(false)
  canUpdate: boolean = false;

  @Optional()
  @Default(false)
  canDelete: boolean = false;
}
