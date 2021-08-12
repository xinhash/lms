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
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Nationality } from "src/models/nationalities/Nationality";
import { NationalitiesService } from "src/services/NationalitiesService";

@Controller("/nationalities")
export class NationalitiesController {
  constructor(private nationalitiesService: NationalitiesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all nationalities")
  @Returns(200, Nationality)
  async getAllNationalities(): Promise<Nationality[]> {
    return this.nationalitiesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return nationality based on id")
  @Returns(200, Nationality)
  async getNationality(
    @PathParams("id") id: string
  ): Promise<Nationality | null> {
    return this.nationalitiesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new nationality")
  @Returns(201, Nationality)
  async createNationality(
    @Req() request: Req,
    @Description("Nationality model")
    @BodyParams()
    @Groups("creation")
    data: Nationality
  ): Promise<Nationality> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.nationalitiesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update nationality with id")
  @Status(201, { description: "Updated nationality", type: Nationality })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() nationality: Nationality
  ): Promise<Nationality | null> {
    return this.nationalitiesService.update(id, nationality);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a nationality")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.nationalitiesService.remove(id);
  }
}
