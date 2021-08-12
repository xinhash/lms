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
  Required,
  Returns,
  Summary,
  Groups,
  Status,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Role } from "src/models/users/Role";
import { RolesService } from "src/services/RolesService";

@Controller("/roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get("/")
  @Summary("Return all roles")
  @Returns(200, Role)
  async getAllRole(): Promise<Role[]> {
    return this.rolesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Return role based on id")
  @Returns(200, Role)
  async getRole(@PathParams("id") id: string): Promise<Role | null> {
    return this.rolesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Create new role")
  @Returns(201, Role)
  async createRole(
    @Req() request: Req,
    @Description("Role model")
    @BodyParams()
    @Groups("creation")
    data: Role
  ): Promise<Role> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.rolesService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Update role with id")
  @Status(201, { description: "Updated role", type: Role })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() role: Role
  ): Promise<Role | null> {
    return this.rolesService.update(id, role);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Remove a role")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.rolesService.remove(id);
  }
}
