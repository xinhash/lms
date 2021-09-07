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
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Fee } from "src/models/fees/Fee";
import { FeesService } from "src/services/FeesService";

@Controller("/fees")
export class FeesController {
  constructor(private feesService: FeesService) {}

  @Get("/")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Fees")
  @Returns(200, Fee)
  async getAllFees(@Req() request: Req): Promise<Fee[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.feesService.query(query);
  }

  @Get("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Fee based on id")
  @Returns(200, Fee)
  async getFee(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Fee | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.feesService.find(id);
  }

  @Post("/")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Fee")
  @Returns(201, Fee)
  async createFee(
    @Req() request: Req,
    @Description("Fee model")
    @BodyParams()
    @Groups("creation")
    data: Fee
  ): Promise<Fee> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.feesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Fee with id")
  @Status(201, { description: "Updated Fee", type: Fee })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Fee: Fee
  ): Promise<Fee | null> {
    return this.feesService.update(id, Fee);
  }

  @Delete("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Fee")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.feesService.remove(id);
  }
}
