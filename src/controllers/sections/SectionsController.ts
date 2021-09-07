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
import { Section } from "src/models/sections/Section";
import { GradesService } from "src/services/GradesService";
import { MediumsService } from "src/services/MediumsService";
import { SectionsService } from "src/services/SectionsService";
import { UsersService } from "src/services/UsersService";

@Controller("/sections")
export class SectionsController {
  constructor(
    private sectionsService: SectionsService,
    private gradesService: GradesService,
    private mediumsService: MediumsService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Sections")
  @Returns(200, Section)
  async getAllSections(@Req() request: Req): Promise<Section[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.sectionsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Section based on id")
  @Returns(200, Section)
  async getSection(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Section | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.sectionsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Section")
  @Returns(201, Section)
  async createSection(
    @Req() request: Req,
    @Description("Section model")
    @BodyParams()
    @Groups("creation")
    data: Section
  ): Promise<Section> {
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
    const medium = await this.mediumsService.find(data.medium.toString());
    if (!medium) {
      throw new Error(`Medium with id: ${data.medium} doesn't exist`);
    }
    return this.sectionsService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Section with id")
  @Status(201, { description: "Updated Section", type: Section })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Section: Section
  ): Promise<Section | null> {
    return this.sectionsService.update(id, Section);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Section")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sectionsService.remove(id);
  }
}
