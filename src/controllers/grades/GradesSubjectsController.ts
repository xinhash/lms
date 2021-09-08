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
import { GradeSubject } from "src/models/grades/GradesSubjects";
import { GradesService } from "src/services/GradesService";
import { GradeSubjectServices } from "src/services/GradesSubjectsService";
import { SubjectsService } from "src/services/SubjectsService";
import { UsersService } from "src/services/UsersService";

@Controller("/grades-subjects")
export class GradesSubjectsController {
  constructor(
    private gradesSubjectsService: GradeSubjectServices,
    private subjectsService: SubjectsService,
    private gradesService: GradesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all GradesSubjects")
  @Returns(200, GradeSubject)
  async getAllGradesSubjects(@Req() request: Req): Promise<GradeSubject[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.gradesSubjectsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return GradeSubject based on id")
  @Returns(200, GradeSubject)
  async getGrade(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<GradeSubject | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.gradesSubjectsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new GradeSubject")
  @Returns(201, GradeSubject)
  async createGrade(
    @Req() request: Req,
    @Required()
    @Description("GradeSubject model")
    @BodyParams("gradeService")
    @Groups("creation")
    gradeService: GradeSubject
  ): Promise<GradeSubject> {
    const user = await this.usersService.find(
      gradeService.createdBy.toString()
    );
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${gradeService.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    const grade = await this.gradesService.find(gradeService.grade.toString());
    if (!grade) {
      throw new Error(`This grade doesn't exist`);
    }
    const subject = await this.subjectsService.find(
      gradeService.subject.toString()
    );
    if (!subject) {
      throw new Error(`This subject doesn't exist`);
    }
    return this.gradesSubjectsService.save(gradeService, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update GradeSubject with id")
  @Status(201, { description: "Updated GradeSubject", type: GradeSubject })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() GradeSubject: GradeSubject
  ): Promise<GradeSubject | null> {
    return this.gradesSubjectsService.update(id, GradeSubject);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a GradeSubject")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.gradesSubjectsService.remove(id);
  }
}
