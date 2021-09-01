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
  @Groups("!creation", "!updation")
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

  @Default(false)
  canCreate?: boolean = false;

  @Default(true)
  canRead?: boolean = true;

  @Default(false)
  canUpdate?: boolean = false;

  @Default(false)
  canDelete?: boolean = false;
}
