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
    const staff = new this.staff(data);
    await staff.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Staff",
    });
    return staff;
  }

  async update(id: string, data: Staff): Promise<Staff | null> {
    const staff = await this.staff.findById(id).exec();
    if (staff) {
      staff.status = data.status;
      await staff.save();
    }
    return null;
  }

  async query(options = {}): Promise<Staff[]> {
    options = objectDefined(options);
    return this.staff.find(options).exec();
  }

  async remove(id: string): Promise<Staff> {
    return await this.staff.findById(id).remove().exec();
  }
}
