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
import { Medium } from "src/models/mediums/Medium";
import { MediumsService } from "src/services/MediumsService";
import { UsersService } from "src/services/UsersService";

@Controller("/mediums")
export class MediumsController {
  constructor(
    private mediumsService: MediumsService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Mediums")
  @Returns(200, Medium)
  async getAllMediums(@Req() request: Req): Promise<Medium[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.mediumsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Medium based on id")
  @Returns(200, Medium)
  async getMedium(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Medium | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.mediumsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Medium")
  @Returns(201, Medium)
  async createMedium(
    @Req() request: Req,
    @Description("Medium model")
    @BodyParams()
    @Groups("creation")
    data: Medium
  ): Promise<Medium> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.mediumsService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Medium with id")
  @Status(201, { description: "Updated Medium", type: Medium })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Medium: Medium
  ): Promise<Medium | null> {
    return this.mediumsService.update(id, Medium);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Medium")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.mediumsService.remove(id);
  }
}
