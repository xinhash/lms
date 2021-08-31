import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Default, Enum, Groups } from "@tsed/schema";
import { User } from "./User";

enum Roles {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Model({ schemaOptions: { timestamps: true } })
export class Role {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Enum(Roles)
  @Default("admin")
  name: string;

  @Ref(() => User)
  @Groups("!updation")
  createdBy?: Ref<User>;
}
