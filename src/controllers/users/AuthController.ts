import {
  BodyParams,
  Controller,
  Get,
  HeaderParams,
  PathParams,
  Post,
  ProviderScope,
  Put,
  Req,
  Scope,
} from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Authenticate, Authorize } from "@tsed/passport";
import {
  Description,
  Required,
  Returns,
  Security,
  Summary,
} from "@tsed/schema";
import { CheckPermissions } from "src/decorators/CheckPermissions";
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post("/login")
  @Authenticate("local")
  async login(
    @Req() req: Req,
    @BodyParams("email") email: string,
    @BodyParams("password") password: string
  ) {
    return req.user;
  }

  @Get("/info")
  @Authorize("jwt")
  @Security("oauth_jwt")
  @Returns(200, User)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUserInfo(@Req() req: Req) {
    return req.user;
  }

  @Post("/signup")
  @Returns(201, User)
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: User) {
    return req.user;
  }

  @Put("/reset-password/:email")
  @Summary("Reset password")
  async resetPassword(
    @PathParams("email")
    @Required()
    email: string,
    @BodyParams("password") @Required password: string,
    @BodyParams("newPassword") @Required newPassword: string
  ) {
    if (password === newPassword) {
      throw new Error("Old and new password shouldn't match");
    }
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new Error("Unable to find user details");
    }
    const passwordMatched = await user.verifyPassword(password);
    if (!passwordMatched) {
      throw new Unauthorized("Wrong credentials");
    }
    user.password = newPassword;
    return this.usersService.update(user._id, user);
  }

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }
}
