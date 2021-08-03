import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
} from "@tsed/common";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { Section } from "src/models/sections/Section";
import { SectionsService } from "src/services/SectionsService";

@Controller("/sections")
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get("/")
  @Summary("Return all Sections")
  @Returns(200, Section)
  async getAllSections(): Promise<Section[]> {
    return this.sectionsService.query();
  }

  @Get("/:id")
  @Summary("Return Section based on id")
  @Returns(200, Section)
  async getSection(@PathParams("id") id: string): Promise<Section | null> {
    return this.sectionsService.find(id);
  }

  @Post("/")
  @Summary("Create new Section")
  @Returns(201, Section)
  async createSection(
    @Description("Section model")
    @BodyParams()
    @Required()
    sectionObj: Section
  ): Promise<Section> {
    return this.sectionsService.save(sectionObj);
  }

  @Put("/:id")
  @Summary("Update Section with id")
  @Status(201, { description: "Updated Section", type: Section })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Section: Section
  ): Promise<Section | null> {
    return this.sectionsService.update(id, Section);
  }

  @Delete("/:id")
  @Summary("Remove a Section")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sectionsService.remove(id);
  }
}
