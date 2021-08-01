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
import { Caste } from "src/models/castes/Caste";
import { CastesService } from "src/services/CastesService";

@Controller("/Castes")
export class NationalitiesController {
  constructor(private castesService: CastesService) {}

  @Get("/")
  @Summary("Return all Castes")
  @Returns(200, Caste)
  async getAllCategories(): Promise<Caste[]> {
    return this.castesService.query();
  }

  @Get("/:id")
  @Summary("Return Caste based on id")
  @Returns(200, Caste)
  async getCaste(@PathParams("id") id: string): Promise<Caste | null> {
    return this.castesService.find(id);
  }

  @Post("/")
  @Summary("Create new Caste")
  @Returns(201, Caste)
  async createCaste(
    @Description("Caste model")
    @BodyParams()
    @Required()
    CasteObj: Caste
  ): Promise<Caste> {
    return this.castesService.save(CasteObj);
  }

  @Put("/:id")
  @Summary("Update Caste with id")
  @Status(201, { description: "Updated Caste", type: Caste })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Caste: Caste
  ): Promise<Caste | null> {
    return this.castesService.update(id, Caste);
  }

  @Delete("/:id")
  @Summary("Remove a Caste")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.castesService.remove(id);
  }
}
