import {
  BodyParams,
  Controller,
  Get,
  HeaderParams,
  Post,
  ProviderScope,
  Req,
  Scope,
} from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Returns } from "@tsed/schema";
import { User } from "src/models/users/User";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthController {
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
  @Returns(200, User)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUserInfo(@Req() req: Req, @HeaderParams("authorization") token: string) {
    return req.user;
  }

  @Post("/signup")
  @Returns(201, User)
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: User) {
    return req.user;
  }

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }
}
