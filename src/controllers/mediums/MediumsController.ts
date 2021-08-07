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
import { Medium } from "src/models/mediums/Medium";
import { MediumsService } from "src/services/MediumsService";

@Controller("/mediums")
export class MediumsController {
  constructor(private mediumsService: MediumsService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Mediums")
  @Returns(200, Medium)
  async getAllMediums(): Promise<Medium[]> {
    return this.mediumsService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Medium based on id")
  @Returns(200, Medium)
  async getMedium(@PathParams("id") id: string): Promise<Medium | null> {
    return this.mediumsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Medium")
  @Returns(201, Medium)
  async createMedium(
    @Req() request: Req,
    @Description("Medium model")
    @BodyParams()
    @Required()
    data: Medium
  ): Promise<Medium> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.mediumsService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Medium with id")
  @Status(201, { description: "Updated Medium", type: Medium })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Medium: Medium
  ): Promise<Medium | null> {
    return this.mediumsService.update(id, Medium);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Medium")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.mediumsService.remove(id);
  }
}
