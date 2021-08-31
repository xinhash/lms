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
import { Subject } from "src/models/subjects/Subject";
import { SubjectsService } from "src/services/SubjectsService";

@Controller("/subjects")
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Get("/")
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
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.subjectsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
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
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a subject")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.subjectsService.remove(id);
  }
}
