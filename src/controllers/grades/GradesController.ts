import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  Req,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Grade } from "src/models/grades/Grades";
import { GradesService } from "src/services/GradesService";

@Controller("/grades")
export class GradesController {
  constructor(private classesService: GradesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Grades")
  @Returns(200, Grade)
  async getAllGrades(): Promise<Grade[]> {
    return this.classesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Grade based on id")
  @Returns(200, Grade)
  async getGrade(@PathParams("id") id: string): Promise<Grade | null> {
    return this.classesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Grade")
  @Returns(201, Grade)
  async createGrade(
    @Req() request: Req,
    @Description("Grade model")
    @BodyParams()
    @Required()
    data: Grade
  ): Promise<Grade> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.classesService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Grade with id")
  @Status(201, { description: "Updated Grade", type: Grade })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Grade: Grade
  ): Promise<Grade | null> {
    return this.classesService.update(id, Grade);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Grade")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.classesService.remove(id);
  }
}
