import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Package } from "src/models/packages/Package";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class PackagesService {
  @Inject(Package) private Package: MongooseModel<Package>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Package | null> {
    const Package = await this.Package.findById(id).exec();

    return Package;
  }

  async save(packageObj: Package, user: EntityCreationUser): Promise<Package> {
    const Package = new this.Package(packageObj);
    await Package.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Package",
    });
    return Package;
  }

  async update(id: string, packageObj: Package): Promise<Package | null> {
    const Package = await this.Package.findById(id).exec();
    if (Package) {
      Package.name = packageObj.name;
      Package.plan = packageObj.plan;
      Package.terms = packageObj.terms;
      Package.description = packageObj.description;
      Package.amount = Number(packageObj.amount);
      Package.status = packageObj.status;

      await Package.save();

      return Package;
    }

    return Package;
  }

  async query(options = {}): Promise<Package[]> {
    options = objectDefined(options);
    return this.Package.find(options).exec();
  }

  async remove(id: string): Promise<Package> {
    return await this.Package.findById(id).remove().exec();
  }
}
