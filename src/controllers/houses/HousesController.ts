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
import { House } from "src/models/houses/House";
import { HousesService } from "src/services/HousesService";
import { UsersService } from "src/services/UsersService";

@Controller("/houses")
export class HousesController {
  constructor(
    private housesService: HousesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Houses")
  @Returns(200, House)
  async getAllHouses(@Req() request: Req): Promise<House[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.housesService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return House based on id")
  @Returns(200, House)
  async getHouse(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<House | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.housesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new House")
  @Returns(201, House)
  async createHouse(
    @Req() request: Req,
    @Description("House model")
    @BodyParams()
    @Groups("creation")
    data: House
  ): Promise<House> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.housesService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update House with id")
  @Status(201, { description: "Updated House", type: House })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() House: House
  ): Promise<House | null> {
    return this.housesService.update(id, House);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a House")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.housesService.remove(id);
  }
}
