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
import { Section } from "src/models/sections/Section";
import { SectionsService } from "src/services/SectionsService";

@Controller("/sections")
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Sections")
  @Returns(200, Section)
  async getAllSections(): Promise<Section[]> {
    return this.sectionsService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Section based on id")
  @Returns(200, Section)
  async getSection(@PathParams("id") id: string): Promise<Section | null> {
    return this.sectionsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Section")
  @Returns(201, Section)
  async createSection(
    @Req() request: Req,
    @Description("Section model")
    @BodyParams()
    @Required()
    data: Section
  ): Promise<Section> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.sectionsService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Section with id")
  @Status(201, { description: "Updated Section", type: Section })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Section: Section
  ): Promise<Section | null> {
    return this.sectionsService.update(id, Section);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Section")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sectionsService.remove(id);
  }
}
