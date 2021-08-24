import { $log, EndpointInfo, IMiddleware, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { PermissionsService } from "src/services/PermissionsService";

@Middleware()
export class PermissionsMiddleware implements IMiddleware {
  constructor(private permissionService: PermissionsService) {}

  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    const roleName = (request.user as any).role;
    if (
      request.user &&
      request.isAuthenticated() &&
      roleName !== "superadmin"
    ) {
      let moduleName = endpoint.get(PermissionsMiddleware);
      const permission = await this.permissionService.findOne({
        moduleName,
        roleName,
        userId: (request.user as any)._id,
      });
      if (!permission) {
        throw new Unauthorized("Insufficient permission");
      } else {
        const method = request.method;
        if (method === "GET") {
          if (!permission.canRead) {
            throw new Unauthorized("Insufficient read permission");
          }
          request.permissions = {
            readIds: permission.readIds,
          };
        } else if (method === "POST") {
          if (!permission.canCreate) {
            throw new Unauthorized("Insufficient write permission");
          }
        } else if (method === "PUT" || method === "PATCH") {
          if (!permission.canUpdate) {
            throw new Unauthorized("Insufficient update permission");
          }
          request.permissions = {
            updateIds: permission.updateIds,
          };
        } else if (method === "DELETE") {
          if (!permission.canDelete) {
            throw new Unauthorized("Insufficient delete permission");
          }
          request.permissions = {
            deleteIds: permission.deleteIds,
          };
        } else {
          throw new Unauthorized("This method is not allowed");
        }
      }
    }
  }
}
