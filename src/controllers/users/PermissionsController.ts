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
import { Permission } from "src/models/users/Permission";
import { PermissionsService } from "src/services/PermissionsService";

@Controller("/permissions")
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Return all permissions")
  @Returns(200, Permission)
  async getAllPermission(@Req() request: Req): Promise<Permission[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.permissionsService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Return permission based on id")
  @Returns(200, Permission)
  async getPermission(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Permission | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.permissionsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Create new permission")
  @Returns(201, Permission)
  async createPermission(
    @Req() request: Req,
    @Description("Permission model")
    @BodyParams()
    @Groups("creation")
    data: Permission
  ): Promise<Permission> {
    if (request.user) {
      data = { ...data, userId: (request.user as any)._id };
    }
    return this.permissionsService.save(data);
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Update permission with id")
  @Status(201, { description: "Updated permission", type: Permission })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() permission: Permission
  ): Promise<Permission | null> {
    return this.permissionsService.update(id, permission);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("superadmin")
  @Summary("Remove a permission")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.permissionsService.remove(id);
  }
}
