import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Default, Enum, Groups } from "@tsed/schema";

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Model({ schemaOptions: { timestamps: true } })
export class Role {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Enum(Roles)
  @Default("admin")
  name: string;
}
