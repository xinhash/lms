import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { School } from "src/models/schools/School";
import { SchoolsService } from "src/services/SchoolsService";

@Controller("/schools")
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all schools")
  @Returns(200, School)
  async getAllSchools(): Promise<School[]> {
    return this.schoolsService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return school based on id")
  @Returns(200, School)
  async getSchool(@PathParams("id") id: string): Promise<School | null> {
    return this.schoolsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new school")
  @Returns(201, School)
  async createSchool(
    @Description("School model") @BodyParams() @Required() schoolObj: School
  ): Promise<School> {
    return this.schoolsService.save(schoolObj);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update school with id")
  @Status(201, { description: "Updated school", type: School })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() school: School
  ): Promise<School | null> {
    return this.schoolsService.update(id, school);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a school")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.schoolsService.remove(id);
  }
}