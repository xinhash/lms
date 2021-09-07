import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { isEmpty } from "lodash";
import { Package } from "src/models/packages/Package";
import { School } from "src/models/schools/School";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class SchoolsService {
  @Inject(School) private school: MongooseModel<School>;
  @Inject(Package) private package: MongooseModel<Package>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<School | null> {
    const school = await this.school
      .findById(id)
      .populate("mainBranch")
      .populate("package")
      .exec();
    return school;
  }

  async findBranches(id: string): Promise<School[]> {
    const school = await this.school.findById(id).exec();
    const branches = school
      ? await this.query({ mainBranch: school.mainBranch })
      : [];
    return branches;
  }

  async save(schoolObj: School, user: EntityCreationUser): Promise<School> {
    // FIXME: Check if package ID exists
    const pkg = await this.package.findById(schoolObj.package);
    if (!pkg) {
      throw new Error("Incorrect package id");
    }
    if (schoolObj.mainBranch) {
      const mainBranch = await this.school.findById(schoolObj.mainBranch);
      if (!mainBranch) {
        throw new Error("Incorrect main branch id");
      }
    }
    const school = new this.school(schoolObj);
    await school.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "School",
    });
    return school;
  }

  async update(id: string, schoolObj: School): Promise<School | null> {
    if (schoolObj.package) {
      const pkg = await this.package.findById(schoolObj.package);
      if (!pkg) {
        throw new Error("Incorrect packageId");
      }
    }
    if (schoolObj.mainBranch) {
      const mainBranch = await this.school.findById(schoolObj.mainBranch);
      if (!mainBranch) {
        throw new Error("Incorrect main branch id");
      }
    }
    const school = await this.school.findById(id).exec();
    if (school) {
      school.name = schoolObj.name || school.name;
      school.domain = schoolObj.domain || school.domain;
      school.address = isEmpty(schoolObj.address)
        ? school.address
        : schoolObj.address;
      school.branch = schoolObj.branch || school.branch;
      school.isMainBranch = schoolObj.isMainBranch;
      if (
        !school.mainBranch &&
        !schoolObj.isMainBranch &&
        !schoolObj.mainBranch
      ) {
        throw new Error(
          "School which are not main branch should pass mainBranch id"
        );
      }
      if (schoolObj.mainBranch) {
        school.mainBranch = schoolObj.mainBranch;
      }
      school.package = schoolObj.package || school.package;
      school.status = schoolObj.status || school.status;

      await school.save();
      return school;
    }

    return null;
  }

  async query(options = {}): Promise<School[]> {
    options = objectDefined(options);
    return this.school
      .find(options)
      .populate("mainBranch")
      .populate("package")
      .exec();
  }

  async remove(id: string): Promise<School> {
    return await this.school.findById(id).remove().exec();
  }
}
