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
import { Caste } from "src/models/castes/Caste";
import { CastesService } from "src/services/CastesService";
import { UsersService } from "src/services/UsersService";

@Controller("/castes")
export class CastesController {
  constructor(
    private castesService: CastesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Castes")
  @Returns(200, Caste)
  async getAllCastes(@Req() request: Req): Promise<Caste[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.castesService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Caste based on id")
  @Returns(200, Caste)
  async getCaste(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Caste | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.castesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Caste")
  @Returns(201, Caste)
  async createCaste(
    @Req() request: Req,
    @Description("Caste model")
    @BodyParams()
    @Groups("creation")
    data: Caste
  ): Promise<Caste> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.castesService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Caste with id")
  @Status(201, { description: "Updated Caste", type: Caste })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Caste: Caste
  ): Promise<Caste | null> {
    return this.castesService.update(id, Caste);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Caste")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.castesService.remove(id);
  }
}
