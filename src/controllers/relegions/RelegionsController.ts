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
import { Religion } from "src/models/religions/Religion";
import { ReligionsService } from "src/services/ReligionsService";

@Controller("/religions")
export class ReligionsController {
  constructor(private religionsService: ReligionsService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all religions")
  @Returns(200, Religion)
  async getAllReligion(@Req() request: Req): Promise<Religion[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.religionsService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return religion based on id")
  @Returns(200, Religion)
  async getReligion(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Religion | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.religionsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new religion")
  @Returns(201, Religion)
  async createReligion(
    @Req() request: Req,
    @Description("Religion model")
    @BodyParams()
    @Groups("creation")
    data: Religion
  ): Promise<Religion> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.religionsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update religion with id")
  @Status(201, { description: "Updated religion", type: Religion })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() religion: Religion
  ): Promise<Religion | null> {
    return this.religionsService.update(id, religion);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a religion")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.religionsService.remove(id);
  }
}
