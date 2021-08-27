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
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Staff } from "src/models/users/Staff";
import { User } from "src/models/users/User";
import { RolesService } from "src/services/RolesService";
import { StaffsService } from "src/services/StaffsService";
import { UsersService } from "src/services/UsersService";

@Controller("/staffs")
export class StaffsController {
  constructor(
    private staffsService: StaffsService,
    private usersService: UsersService,
    private rolesService: RolesService
  ) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Staffs")
  @Returns(200, Staff)
  async getAllStaffs(@Req() request: Req): Promise<Staff[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.staffsService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Staff based on id")
  @Returns(200, Staff)
  async getStaff(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Staff | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.staffsService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Staff")
  @Returns(201, Staff)
  async createStaff(
    @Req() request: Req,
    @BodyParams("user")
    @Groups("creation")
    user: User,
    @Description("Staff model")
    @BodyParams("staff")
    @Groups("creation")
    staff: Staff
  ): Promise<Staff> {
    const requestUserRole = (request.user as any).role;
    if (user.role !== "staff") {
      throw new Error("Insufficient permission. Only staffs can be created");
    }
    if (requestUserRole === "superadmin" && !user.adminId) {
      throw new Error("Missing field : adminId");
    }
    if (user.role) {
      const role = await this.rolesService.findOne({ name: user.role });
      if (role?._id) {
        user.roleId = role?._id;
      }
    }
    const nuser = await this.usersService.save(user);
    staff.user = nuser._id
    return this.staffsService.save(staff, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: nuser._id,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Staff with id")
  @Status(201, { description: "Updated Staff", type: Staff })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Staff: Staff
  ): Promise<Staff | null> {
    return this.staffsService.update(id, Staff);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Staff")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.staffsService.remove(id);
  }
}
