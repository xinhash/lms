import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Package } from "src/models/packages/Package";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class PackagesService {
  @Inject(Package) private pkg: MongooseModel<Package>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Package | null> {
    const pkg = await this.pkg.findById(id).exec();
    return pkg;
  }

  async save(packageObj: Package, user: EntityCreationUser): Promise<Package> {
    if (
      packageObj.dueDate &&
      new Date(packageObj.dueDate).getTime() < Date.now()
    ) {
      throw new Error("Due date can't be in past");
    }
    const pkg = new this.pkg(packageObj);
    await pkg.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Package",
    });
    return pkg;
  }

  async update(id: string, packageObj: Package): Promise<Package | null> {
    if (
      packageObj.dueDate &&
      new Date(packageObj.dueDate).getTime() < Date.now()
    ) {
      throw new Error("Due date can't be in past");
    }
    const pkg = await this.pkg.findById(id).exec();
    if (pkg) {
      pkg.name = packageObj.name || pkg.name;
      pkg.plan = packageObj.plan || pkg.plan;
      pkg.terms = packageObj.terms || pkg.terms;
      pkg.description = packageObj.description || pkg.description;
      pkg.amount = Number(packageObj.amount) || pkg.amount;
      pkg.status = packageObj.status || pkg.status;
      pkg.dueDate = packageObj.dueDate || pkg.dueDate;
      pkg.billDate = packageObj.billDate || pkg.billDate;
      await pkg.save();

      return pkg;
    }

    return null;
  }

  async query(options = {}): Promise<Package[]> {
    options = objectDefined(options);
    return this.pkg.find(options).exec();
  }

  async remove(id: string): Promise<Package> {
    return await this.pkg.findById(id).remove().exec();
  }
}
