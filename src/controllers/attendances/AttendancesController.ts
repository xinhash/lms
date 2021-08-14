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
import { Attendance } from "src/models/attendances/Attendance";
import { AttendancesService } from "src/services/AttendancesService";

@Controller("/attendances")
export class AttendancesController {
  constructor(private attendancesService: AttendancesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Attendances")
  @Returns(200, Attendance)
  async getAllAttendances(@Req() request: Req): Promise<Attendance[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.attendancesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Attendance based on id")
  @Returns(200, Attendance)
  async getAttendance(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Attendance | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.attendancesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Attendance")
  @Returns(201, Attendance)
  async createAttendance(
    @Req() request: Req,
    @Description("Attendance model")
    @BodyParams()
    @Groups("creation")
    data: Attendance
  ): Promise<Attendance> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.attendancesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Attendance with id")
  @Status(201, { description: "Updated Attendance", type: Attendance })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Attendance: Attendance
  ): Promise<Attendance | null> {
    return this.attendancesService.update(id, Attendance);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Attendance")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.attendancesService.remove(id);
  }
}
