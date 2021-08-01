import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Religion } from "src/models/religions/Religion";

@Service()
export class ReligionsService {
  @Inject(Religion) private religion: MongooseModel<Religion>;

  async find(id: string): Promise<Religion | null> {
    const religion = await this.religion.findById(id).exec();
    $log.debug("Found religion", religion);
    return religion;
  }

  async save(religionObj: Religion): Promise<Religion> {
    const religion = new this.religion(religionObj);
    await religion.save();
    $log.debug("Saved religion", religion);
    return religion;
  }

  async update(id: string, religionObj: Religion): Promise<Religion | null> {
    const religion = await this.religion.findById(id).exec();
    if (religion) {
      religion.name = religionObj.name;
      religion.status = religionObj.status;

      await religion.save();
      $log.debug("Updated religion", religion);
      return religion;
    }

    return religion;
  }

  async query(options = {}): Promise<Religion[]> {
    return this.religion.find(options).exec();
  }

  async remove(id: string): Promise<Religion> {
    return await this.religion.findById(id).remove().exec();
  }
}
