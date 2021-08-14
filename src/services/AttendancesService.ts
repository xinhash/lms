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
    const Attendance = await this.attendance.findById(id).exec();
    return Attendance;
  }

  async save(data: Attendance, user: EntityCreationUser): Promise<Attendance> {
    const Attendance = new this.attendance(data);
    await Attendance.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Attendance",
    });
    return Attendance;
  }

  async update(id: string, data: Attendance): Promise<Attendance | null> {
    const Attendance = await this.attendance.findById(id).exec();
    if (Attendance) {
      Attendance.student = data.student;
      Attendance.grade = data.grade;
      Attendance.section = data.section;
      Attendance.text = data.text;
      Attendance.date = data.date;
      Attendance.status = data.status;
      await Attendance.save();
    }
    return Attendance;
  }

  async query(options = {}): Promise<Attendance[]> {
    options = objectDefined(options);
    return this.attendance.find(options).exec();
  }

  async remove(id: string): Promise<Attendance> {
    return await this.attendance.findById(id).remove().exec();
  }
}
