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
import { Class } from "src/models/classes/Classes";
import { SectionsService } from "src/services/ClassesService";

@Controller("/Classes")
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get("/")
  @Summary("Return all Classes")
  @Returns(200, Class)
  async getAllSections(): Promise<Class[]> {
    return this.sectionsService.query();
  }

  @Get("/:id")
  @Summary("Return Class based on id")
  @Returns(200, Class)
  async getSection(@PathParams("id") id: string): Promise<Class | null> {
    return this.sectionsService.find(id);
  }

  @Post("/")
  @Summary("Create new Class")
  @Returns(201, Class)
  async createSection(
    @Description("Class model")
    @BodyParams()
    @Required()
    SectionObj: Class
  ): Promise<Class> {
    return this.sectionsService.save(SectionObj);
  }

  @Put("/:id")
  @Summary("Update Class with id")
  @Status(201, { description: "Updated Class", type: Class })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Class: Class
  ): Promise<Class | null> {
    return this.sectionsService.update(id, Class);
  }

  @Delete("/:id")
  @Summary("Remove a Class")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sectionsService.remove(id);
  }
}
