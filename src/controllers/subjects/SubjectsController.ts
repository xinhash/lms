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
import { Subject } from "src/models/subjects/Subject";
import { GradesService } from "src/services/GradesService";
import { SubjectsService } from "src/services/SubjectsService";
import { UsersService } from "src/services/UsersService";

@Controller("/subjects")
export class SubjectsController {
  constructor(
    private subjectsService: SubjectsService,
    private gradesService: GradesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all subjects")
  @Returns(200, Subject)
  async getAllSubject(@Req() request: Req): Promise<Subject[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.subjectsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return subject based on id")
  @Returns(200, Subject)
  async getSubject(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Subject | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.subjectsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new subject")
  @Returns(201, Subject)
  async createSubject(
    @Req() request: Req,
    @Description("Subject model")
    @BodyParams()
    @Groups("creation")
    data: Subject
  ): Promise<Subject> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    const grade = await this.gradesService.find(data.grade.toString());
    if (!grade) {
      throw new Error(`Grade with id: ${data.grade} doesn't exist`);
    }
    return this.subjectsService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update subject with id")
  @Status(201, { description: "Updated subject", type: Subject })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() subject: Subject
  ): Promise<Subject | null> {
    return this.subjectsService.update(id, subject);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a subject")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.subjectsService.remove(id);
  }
}
