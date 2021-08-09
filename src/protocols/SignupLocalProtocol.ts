import { BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { Forbidden } from "@tsed/exceptions";
import { UsersService } from "src/services/UsersService";
import { User } from "src/models/users/User";
import { Groups } from "@tsed/schema";
import { RolesService } from "src/services/RolesService";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  async $onVerify(
    @Req() request: Req,
    @BodyParams() @Groups("creation") user: User
  ) {
    const { email } = user;
    const found = await this.usersService.findOne({ email });

    if (found) {
      throw new Forbidden("Email is already registered");
    }
    user.username = request.body.username;
    if (user.role) {
      const role = await this.rolesService.findOne({ name: user.role });
      if (role?._id) {
        user.roleId = role?._id;
      }
    }
    return this.usersService.save(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
