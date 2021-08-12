import {
  BodyParams,
  Controller,
  Get,
  HeaderParams,
  PathParams,
  Post,
  Req,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Returns, Summary, Groups } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { CheckPermissions } from "src/decorators/CheckPermissions";
import { User } from "src/models/users/User";
import { RolesService } from "src/services/RolesService";
import { UsersService } from "src/services/UsersService";

@Controller("/users")
@Authorize("jwt")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  @Get("/")
  @CheckPermissions("User")
  @Summary("Return all users")
  @Returns(200, User)
  async getAllUsers(@Req() request: Req): Promise<User[]> {
    console.log(request.user);
    return this.usersService.query({ _id: request.permissions.readIds });
  }

  @Get("/:id")
  @CheckPermissions("User")
  @Summary("Return User based on id")
  @Returns(200, User)
  async getUser(
    @Req() request: Req,
    @PathParams("id") id: string,
    @HeaderParams("authorization") token: string
  ): Promise<User | null> {
    console.log(request.permissions);
    if (
      request.permissions.readIds &&
      !request.permissions.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.usersService.find(id);
  }

  @Post("/")
  @AcceptRoles("admin")
  @Summary("Create new user")
  @Returns(201, User)
  async createUser(
    @Req() request: Req,
    @HeaderParams("authorization") token: string,
    @Description("User model")
    @BodyParams()
    @Groups("creation")
    data: User
  ): Promise<User> {
    const requestUserRole = (request.user as any).role;
    if (data.role === "superadmin") {
      // @ToDo: Validation should be done at once.
      throw new Error("Insufficient permission");
    }
    if (data.role === "admin" && requestUserRole === "admin") {
      throw new Error("Only superadmin can create Admin");
    }
    if (
      requestUserRole === "superadmin" &&
      ["teacher", "student"].includes(data.role) &&
      !data.adminId
    ) {
      throw new Error("Missing field : adminId");
    }
    if (data.role) {
      const role = await this.rolesService.findOne({ name: data.role });
      if (role?._id) {
        data.roleId = role?._id;
      }
    }
    return this.usersService.save(data);
  }
}
