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
import { Caste } from "src/models/castes/Caste";
import { CastesService } from "src/services/CastesService";

@Controller("/castes")
export class CastesController {
  constructor(private castesService: CastesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Castes")
  @Returns(200, Caste)
  async getAllCastes(): Promise<Caste[]> {
    return this.castesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Caste based on id")
  @Returns(200, Caste)
  async getCaste(@PathParams("id") id: string): Promise<Caste | null> {
    return this.castesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Caste")
  @Returns(201, Caste)
  async createCaste(
    @Req() request: Req,
    @Description("Caste model")
    @BodyParams()
    @Required()
    data: Caste
  ): Promise<Caste> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.castesService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Caste with id")
  @Status(201, { description: "Updated Caste", type: Caste })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Caste: Caste
  ): Promise<Caste | null> {
    return this.castesService.update(id, Caste);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Caste")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.castesService.remove(id);
  }
}
