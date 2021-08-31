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
import {
  Description,
  Groups,
  Required,
  Returns,
  Status,
  Summary,
} from "@tsed/schema";
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
  async getAllGrades(@Req() request: Req): Promise<Grade[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.classesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Grade based on id")
  @Returns(200, Grade)
  async getGrade(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Grade | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
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
    @Groups("creation")
    data: Grade
  ): Promise<Grade> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.classesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Grade with id")
  @Status(201, { description: "Updated Grade", type: Grade })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Grade: Grade
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
