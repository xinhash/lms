import {
  BodyParams,
  Controller,
  Delete,
  Get,
  MultipartFile,
  PathParams,
  PlatformMulterFile,
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
  @Security("oauth_jwt")
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
  @Security("oauth_jwt")
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
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Staff")
  @Returns(201, Staff)
  async createStaff(
    @Req() request: Req,
    @BodyParams("user")
    @Groups("staffCreation")
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
    console.log(user.adminId);
    if (requestUserRole === "superadmin" && !user.adminId) {
      throw new Error("Missing field : adminId");
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
    const nuser = await this.usersService.save(user);
    staff.user = nuser._id;
    return this.staffsService.save(staff, {
      role: nuser.role,
      _id: nuser._id,
      adminId: nuser._id,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Staff with id")
  @Status(201, { description: "Updated Staff", type: Staff })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Staff: Staff
  ): Promise<Staff | null> {
    return this.staffsService.update(id, Staff);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Staff")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.staffsService.remove(id);
  }

  @Put("/upload-documents/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Upload resume, joining letter and other documents")
  @Returns(201, Staff)
  async uploadDocuments(
    @PathParams("id") @Required() id: string,
    @MultipartFile("resume") resume: PlatformMulterFile,
    @MultipartFile("joiningLetter") joiningLetter: PlatformMulterFile,
    @MultipartFile("otherDocuments", 4) otherDocuments: PlatformMulterFile[]
  ) {
    const staff = await this.staffsService.find(id);
    if (!staff) {
      throw new Error("Unable to find staff details");
    }
    if (!resume || !joiningLetter) {
      throw new Error("Insufficient data. Resume or Joining Letter");
    } else {
      if (resume.originalname === joiningLetter.originalname) {
        throw new Error("Resume and JoiningLetter name should be different");
      }
      staff.resume = `/uploads/${resume.filename}`;
      staff.joiningLetter = `/uploads/${joiningLetter.filename}`;
    }
    if (otherDocuments?.length > 0) {
      staff.otherDocuments = otherDocuments.map(
        (doc) => `/uploads/${doc.filename}`
      );
    }
    return this.staffsService.update(id, staff);
  }
}
