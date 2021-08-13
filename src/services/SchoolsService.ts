import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { School } from "src/models/schools/School";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class SchoolsService {
  @Inject(School) private school: MongooseModel<School>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<School | null> {
    const school = await this.school.findById(id).exec();
    return school;
  }

  async findBranches(id: string): Promise<School[]> {
    const school = await this.school.findById(id).exec();
    const branches = school
      ? await this.query({ mainBranchId: school.mainBranchId })
      : [];
    return branches;
  }

  async save(schoolObj: School, user: EntityCreationUser): Promise<School> {
    const school = new this.school(schoolObj);
    await school.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "School",
    });
    return school;
  }

  async update(id: string, schoolObj: School): Promise<School | null> {
    const school = await this.school.findById(id).exec();
    if (school) {
      school.name = schoolObj.name;
      school.domain = schoolObj.domain;
      school.address = schoolObj.address;
      school.branch = schoolObj.branch;
      school.isMainBranch = schoolObj.isMainBranch;
      school.packagedId = schoolObj.packagedId;
      school.status = schoolObj.status;

      await school.save();
      return school;
    }

    return school;
  }

  async query(options = {}): Promise<School[]> {
    options = objectDefined(options);
    return this.school.find(options).exec();
  }

  async remove(id: string): Promise<School> {
    return await this.school.findById(id).remove().exec();
  }
}
