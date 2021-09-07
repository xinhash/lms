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
import { SectionsService } from "src/services/SectionsService";

@Controller("/sections")
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get("/")
  @Security('oauth_jwt')
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
  @Security('oauth_jwt')
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
  @Security('oauth_jwt')
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
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.sectionsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Security('oauth_jwt')
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
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Section")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sectionsService.remove(id);
  }
}
