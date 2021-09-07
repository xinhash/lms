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
import { Nationality } from "src/models/nationalities/Nationality";
import { NationalitiesService } from "src/services/NationalitiesService";
import { UsersService } from "src/services/UsersService";

@Controller("/nationalities")
export class NationalitiesController {
  constructor(
    private nationalitiesService: NationalitiesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all nationalities")
  @Returns(200, Nationality)
  async getAllNationalities(@Req() request: Req): Promise<Nationality[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.nationalitiesService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return nationality based on id")
  @Returns(200, Nationality)
  async getNationality(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Nationality | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.nationalitiesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
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
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.nationalitiesService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update nationality with id")
  @Status(201, { description: "Updated nationality", type: Nationality })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() nationality: Nationality
  ): Promise<Nationality | null> {
    return this.nationalitiesService.update(id, nationality);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a nationality")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.nationalitiesService.remove(id);
  }
}
