import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Attendance } from "src/models/attendances/Attendance";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class AttendancesService {
  @Inject(Attendance) private attendance: MongooseModel<Attendance>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Attendance | null> {
    const Attendance = await this.attendance
      .findById(id)
      .populate("student")
      .populate("grade")
      .populate("sections")
      .exec();
    return Attendance;
  }

  async save(data: Attendance, user: EntityCreationUser): Promise<Attendance> {
    const attendance = new this.attendance(data);
    await attendance.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Attendance",
    });
    return attendance;
  }

  async update(id: string, data: Attendance): Promise<Attendance | null> {
    const attendance = await this.attendance.findById(id).exec();
    if (attendance) {
      attendance.student = data.student;
      attendance.grade = data.grade;
      attendance.section = data.section;
      attendance.text = data.text;
      attendance.date = data.date;
      attendance.status = data.status;
      await attendance.save();
      return attendance;
    }
    return null;
  }

  async query(options = {}): Promise<Attendance[]> {
    options = objectDefined(options);
    return this.attendance
      .find(options)
      .populate("student")
      .populate("grade")
      .populate("sections")
      .exec();
  }

  async remove(id: string): Promise<Attendance> {
    return await this.attendance.findById(id).remove().exec();
  }
}
