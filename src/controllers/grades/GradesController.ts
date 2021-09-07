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
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Grade } from "src/models/grades/Grades";
import { CoursesService } from "src/services/CoursesService";
import { GradesService } from "src/services/GradesService";
import { UsersService } from "src/services/UsersService";

@Controller("/grades")
export class GradesController {
  constructor(
    private gradesService: GradesService,
    private coursesService: CoursesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Grades")
  @Returns(200, Grade)
  async getAllGrades(@Req() request: Req): Promise<Grade[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.gradesService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
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
    return this.gradesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Grade")
  @Returns(201, Grade)
  async createGrade(
    @Req() request: Req,
    @Required()
    @Description("Grade model")
    @BodyParams("grade")
    @Groups("creation")
    grade: Grade
  ): Promise<Grade> {
    const user = await this.usersService.find(grade.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${grade.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    const course = await this.coursesService.find(grade.course.toString());
    if (!course) {
      throw new Error(`This course doesn't exist`);
    }
    return this.gradesService.save(grade, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Grade with id")
  @Status(201, { description: "Updated Grade", type: Grade })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Grade: Grade
  ): Promise<Grade | null> {
    return this.gradesService.update(id, Grade);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Grade")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.gradesService.remove(id);
  }
}
