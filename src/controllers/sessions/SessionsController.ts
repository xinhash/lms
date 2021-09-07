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
  Groups,
  Required,
  Returns,
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Session } from "src/models/sessions/Session";
import { SessionsService } from "src/services/SessionsService";

@Controller("/sessions")
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get("/")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Sessions")
  @Returns(200, Session)
  async getAllSessions(@Req() request: Req): Promise<Session[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.sessionsService.query(query);
  }

  @Get("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Session based on id")
  @Returns(200, Session)
  async getSession(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Session | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.sessionsService.find(id);
  }

  @Post("/")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Session")
  @Returns(201, Session)
  async createSession(
    @Req() request: Req,
    @Description("Session model")
    @BodyParams()
    @Groups("creation")
    data: Session
  ): Promise<Session> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.sessionsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Session with id")
  @Status(201, { description: "Updated Session", type: Session })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Session: Session
  ): Promise<Session | null> {
    return this.sessionsService.update(id, Session);
  }

  @Delete("/:id")
  @Security('oauth_jwt')
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Session")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.sessionsService.remove(id);
  }
}
