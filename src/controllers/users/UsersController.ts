import { BodyParams, Controller, Get, Post } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Summary, Groups } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";

@Controller("/users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/")
  @Authorize("jwt")
  @Summary("Return all users")
  @Returns(200, User)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.query();
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new user")
  @Returns(201, User)
  async createUser(
    @Description("User model")
    @BodyParams()
    @Groups("creation")
    @Required()
    data: User
  ): Promise<User> {
    return this.usersService.save(data);
  }
}
