import { Model, ObjectID, Ref, Schema } from "@tsed/mongoose";
import { Default, Enum, Groups, Property } from "@tsed/schema";
import { User } from "../users/User";
import { Role } from "./Role";

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Schema()
class PermissionRoles {
  @ObjectID("id")
  _id: string;

  @Ref(Role)
  roleId: Ref<Role>;

  @Property()
  roleName: string;

  @Property()
  create: boolean = true;

  @Property()
  readAttributes: string[];

  @Property()
  updateAttributes: string[];

  @Property()
  read: boolean = true;

  @Property()
  update: boolean = true;

  @Property()
  delete: boolean = true;
}

@Model({ schemaOptions: { timestamps: true } })
export class Permission {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Enum(Roles)
  @Default("admin")
  name: string;

  @Property()
  permissionRoles: PermissionRoles;

  @Ref(User)
  createdBy?: Ref<User>;
}
