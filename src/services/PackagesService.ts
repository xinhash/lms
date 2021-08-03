import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Package } from "src/models/packages/Package";

@Service()
export class PackagesService {
  @Inject(Package) private Package: MongooseModel<Package>;

  async find(id: string): Promise<Package | null> {
    const Package = await this.Package.findById(id).exec();
    $log.debug("Found Package", Package);
    return Package;
  }

  async save(packageObj: Package): Promise<Package> {
    const Package = new this.Package(packageObj);
    await Package.save();
    $log.debug("Saved Package", Package);
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
      $log.debug("Updated Package", Package);
      return Package;
    }

    return Package;
  }

  async query(options = {}): Promise<Package[]> {
    return this.Package.find(options).exec();
  }

  async remove(id: string): Promise<Package> {
    return await this.Package.findById(id).remove().exec();
  }
}
