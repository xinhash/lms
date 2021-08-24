import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Department } from "src/models/departments/Department";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class DepartmentsService {
  @Inject(Department) private department: MongooseModel<Department>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Department | null> {
    const Department = await this.department.findById(id).exec();

    return Department;
  }

  async save(data: Department, user: EntityCreationUser): Promise<Department> {
    const Department = new this.department(data);
    await Department.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Department",
    });
    return Department;
  }

  async update(id: string, data: Department): Promise<Department | null> {
    const Department = await this.department.findById(id).exec();
    if (Department) {
      Department.name = data.name;
      Department.status = data.status;
      await Department.save();
    }
    return Department;
  }

  async query(options = {}): Promise<Department[]> {
    options = objectDefined(options);
    return this.department.find(options).exec();
  }

  async remove(id: string): Promise<Department> {
    return await this.department.findById(id).remove().exec();
  }
}
