import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Medium } from "src/models/mediums/Medium";

@Service()
export class MediumsService {
  @Inject(Medium) private Medium: MongooseModel<Medium>;

  async find(id: string): Promise<Medium | null> {
    const Medium = await this.Medium.findById(id).exec();

    return Medium;
  }

  async save(mediumObj: Medium): Promise<Medium> {
    const Medium = new this.Medium(mediumObj);
    await Medium.save();

    return Medium;
  }

  async update(id: string, mediumObj: Medium): Promise<Medium | null> {
    const Medium = await this.Medium.findById(id).exec();
    if (Medium) {
      Medium.name = mediumObj.name;
      Medium.status = mediumObj.status;

      await Medium.save();

      return Medium;
    }

    return Medium;
  }

  async query(options = {}): Promise<Medium[]> {
    return this.Medium.find(options).exec();
  }

  async remove(id: string): Promise<Medium> {
    return await this.Medium.findById(id).remove().exec();
  }
}
