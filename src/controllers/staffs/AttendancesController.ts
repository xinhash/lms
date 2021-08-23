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
import { StaffsService } from "src/services/StaffsService";

@Controller("/staffs")
export class StaffsController {
  constructor(private staffsService: StaffsService) {}

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
    @Description("Staff model")
    @BodyParams()
    @Groups("creation")
    data: Staff
  ): Promise<Staff> {
    return this.staffsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
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
