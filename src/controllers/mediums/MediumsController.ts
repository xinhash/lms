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
import { Medium } from "src/models/mediums/Medium";
import { MediumsService } from "src/services/MediumsService";

@Controller("/mediums")
export class MediumsController {
  constructor(private mediumsService: MediumsService) {}

  @Get("/")
  @Summary("Return all Mediums")
  @Returns(200, Medium)
  async getAllMediums(): Promise<Medium[]> {
    return this.mediumsService.query();
  }

  @Get("/:id")
  @Summary("Return Medium based on id")
  @Returns(200, Medium)
  async getMedium(@PathParams("id") id: string): Promise<Medium | null> {
    return this.mediumsService.find(id);
  }

  @Post("/")
  @Summary("Create new Medium")
  @Returns(201, Medium)
  async createMedium(
    @Description("Medium model")
    @BodyParams()
    @Required()
    MediumObj: Medium
  ): Promise<Medium> {
    return this.mediumsService.save(MediumObj);
  }

  @Put("/:id")
  @Summary("Update Medium with id")
  @Status(201, { description: "Updated Medium", type: Medium })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Medium: Medium
  ): Promise<Medium | null> {
    return this.mediumsService.update(id, Medium);
  }

  @Delete("/:id")
  @Summary("Remove a Medium")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.mediumsService.remove(id);
  }
}
