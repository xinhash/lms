import {
  BodyParams,
  Controller,
  Get,
  HeaderParams,
  MultipartFile,
  PathParams,
  PlatformMulterFile,
  Post,
  Req,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Returns, Summary, Groups, Security } from "@tsed/schema";
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
  @Security("oauth_jwt")
  @Authorize("jwt")
  @CheckPermissions("User")
  @Summary("Return all users")
  @Returns(200, User)
  async getAllUsers(@Req() request: Req): Promise<User[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.usersService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @CheckPermissions("User")
  @Summary("Return User based on id")
  @Returns(200, User)
  async getUser(
    @Req() request: Req,
    @PathParams("id") id: string,
    @HeaderParams("authorization") token: string
  ): Promise<User | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.usersService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Create new user")
  @Returns(201, User)
  async createUser(
    @Req() request: Req,
    @Description("User model")
    @BodyParams()
    @Groups("creation")
    data: User
    // @MultipartFile("photo") photo: PlatformMulterFile
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
      ["staff", "student"].includes(data.role) &&
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
    // if(photo.filename) {
    //   data.photo = photo.filename
    // }
    return this.usersService.save(data);
  }
}
