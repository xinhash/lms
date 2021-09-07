import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  Req,
  QueryParams,
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
import { School } from "src/models/schools/School";
import { User } from "src/models/users/User";
import { RolesService } from "src/services/RolesService";
import { SchoolsService } from "src/services/SchoolsService";
import { SessionsService } from "src/services/SessionsService";
import { UsersService } from "src/services/UsersService";
import { generateSessions } from "src/utils";

@Controller("/schools")
export class SchoolsController {
  constructor(
    private schoolsService: SchoolsService,
    private rolesService: RolesService,
    private usersService: UsersService,
    private sessionService: SessionsService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all schools")
  @Returns(200, School)
  async getAllSchools(@Req() request: Req): Promise<School[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.schoolsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return school branches based on school id")
  @Returns(200, School)
  async getSchoolBranches(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<School[]> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.schoolsService.findBranches(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new school")
  @Returns(201, School)
  async createSchool(
    @Req() request: Req,
    @Required()
    @Description("User model")
    @BodyParams("user")
    @Groups("creation")
    user: User,
    @Required()
    @Description("School model")
    @BodyParams("school")
    @Groups("creation")
    school: School
  ): Promise<School> {
    if (!user.role) {
      user.role = "admin";
    }
    if (user.role !== "admin") {
      throw new Error("Insufficient permission. Only admin can create school");
    }
    if (user.role) {
      const role = await this.rolesService.findOne({ name: user.role });
      if (role?._id) {
        user.roleId = role?._id;
      }
    }
    if (request.user) {
      user.adminId = (request.user as any)._id;
      user.createdBy = (request.user as any)._id;
    }
    const nuser = await this.usersService.findOrCreate(user);
    if (!nuser) {
      throw new Error("Unable to create school admin");
    } else {
      school = {
        ...school,
        createdBy: nuser._id,
      };
    }
    return this.schoolsService.save(school, {
      role: nuser.role,
      _id: nuser._id,
      adminId: nuser._id,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update school with id")
  @Status(201, { description: "Updated school", type: School })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() school: School
  ): Promise<School | null> {
    return this.schoolsService.update(id, school);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a school")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.schoolsService.remove(id);
  }

  @Get("/:id/sessions")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return sessions based on school id")
  async getSchoolSessions(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<string[]> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    const school = await this.schoolsService.find(id);
    if (!school) {
      throw new Error(`Unable to find session for school with id: ${id}`);
    } else {
      const user = await this.usersService.find(school.createdBy.toString());
      const sessions = generateSessions(school.startedAt);
      await Promise.all(
        sessions.map((session) =>
          this.sessionService.save(
            {
              school: school._id,
              name: session,
              createdBy: school.createdBy,
            },
            {
              role: user?.role || (request.user as any).role,
              _id: school.createdBy.toString(),
              adminId: school.createdBy,
            }
          )
        )
      );
      return sessions;
    }
  }
}
