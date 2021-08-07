import { EndpointInfo, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
@Middleware()
export class AcceptRolesMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    if (request.user && request.isAuthenticated()) {
      let roles = endpoint.get(AcceptRolesMiddleware);
      if (roles.length > 0 && !roles.includes("superadmin")) {
        roles = [...new Set([...roles, "superadmin"])];
      }
      if (!roles.includes((request.user as any).role)) {
        throw new Unauthorized("Insufficient role");
      }
    }
  }
}
