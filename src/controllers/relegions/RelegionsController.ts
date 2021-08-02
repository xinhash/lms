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
import { Religion } from "src/models/religions/Religion";
import { ReligionsService } from "src/services/ReligionsService";

@Controller("/religions")
export class NationalitiesController {
  constructor(private religionsService: ReligionsService) {}

  @Get("/")
  @Summary("Return all religions")
  @Returns(200, Religion)
  async getAllReligion(): Promise<Religion[]> {
    return this.religionsService.query();
  }

  @Get("/:id")
  @Summary("Return religion based on id")
  @Returns(200, Religion)
  async getReligion(@PathParams("id") id: string): Promise<Religion | null> {
    return this.religionsService.find(id);
  }

  @Post("/")
  @Summary("Create new religion")
  @Returns(201, Religion)
  async createReligion(
    @Description("Religion model")
    @BodyParams()
    @Required()
    religionObj: Religion
  ): Promise<Religion> {
    return this.religionsService.save(religionObj);
  }

  @Put("/:id")
  @Summary("Update religion with id")
  @Status(201, { description: "Updated religion", type: Religion })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() religion: Religion
  ): Promise<Religion | null> {
    return this.religionsService.update(id, religion);
  }

  @Delete("/:id")
  @Summary("Remove a religion")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.religionsService.remove(id);
  }
}
