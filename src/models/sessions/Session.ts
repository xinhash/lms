import { Model, PreHook, Ref } from "@tsed/mongoose";
import { CollectionOf, Format, Optional, Required } from "@tsed/schema";
import { generateSessions } from "src/utils";
import { School } from "../schools/School";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Session {
	@Ref(School)
	@Required()
	school: Ref<School>

	@Required()
	name: string

	@Optional()
	description?: string

	@Ref(User)
	createdBy?: Ref<User>;
}