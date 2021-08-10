import { $log, EndpointInfo, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { PermissionsService } from "src/services/PermissionsService";

@Middleware()
export class PermissionsMiddleware {
  constructor(private permissionService: PermissionsService) {}

  async use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    if (request.user && request.isAuthenticated()) {
      let [moduleName, roleName] = endpoint.get(PermissionsMiddleware);
      try {
        const permission = await this.permissionService.findOne({
          moduleName,
          roleName,
        });
        if (!permission) {
          throw new Unauthorized("Insufficient permission");
        } else {
          const method = request.method;
          if (method === "GET") {
            if (!permission.read) {
              throw new Unauthorized("Insufficient read permission");
            }
          } else if (method === "POST") {
            if (!permission.create) {
              throw new Unauthorized("Insufficient write permission");
            }
          } else if (method === "PUT" || method === "PATCH") {
            if (!permission.update) {
              throw new Unauthorized("Insufficient update permission");
            }
          } else if (method === "DELETE") {
            if (!permission.delete) {
              throw new Unauthorized("Insufficient delete permission");
            }
          } else {
            throw new Unauthorized("This method is not allowed");
          }
        }
      } catch (error) {
        $log.error(error);
        throw new Unauthorized(
          `Permissions haven't been granted for ${moduleName} and ${roleName}`
        );
      }
    }
  }
}
