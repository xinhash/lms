import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Staff } from "src/models/users/Staff";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class StaffsService {
  @Inject(Staff) private staff: MongooseModel<Staff>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Staff | null> {
    const Staff = await this.staff.findById(id).exec();
    return Staff;
  }

  async save(data: Staff, user: EntityCreationUser): Promise<Staff> {
    const Staff = new this.staff(data);
    await Staff.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Staff",
    });
    return Staff;
  }

  async update(id: string, data: Staff): Promise<Staff | null> {
    const Staff = await this.staff.findById(id).exec();
    // if (Staff) {
    //   Staff.student = data.student;
    //   Staff.grade = data.grade;
    //   Staff.section = data.section;
    //   Staff.text = data.text;
    //   Staff.date = data.date;
    //   Staff.status = data.status;
    //   await Staff.save();
    // }
    return Staff;
  }

  async query(options = {}): Promise<Staff[]> {
    options = objectDefined(options);
    return this.staff.find(options).exec();
  }

  async remove(id: string): Promise<Staff> {
    return await this.staff.findById(id).remove().exec();
  }
}
