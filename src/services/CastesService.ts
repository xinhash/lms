import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Caste } from "src/models/castes/Caste";

@Service()
export class CastesService {
  @Inject(Caste) private Caste: MongooseModel<Caste>;

  async find(id: string): Promise<Caste | null> {
    const Caste = await this.Caste.findById(id).exec();
    $log.debug("Found Caste", Caste);
    return Caste;
  }

  async save(CasteObj: Caste): Promise<Caste> {
    const Caste = new this.Caste(CasteObj);
    await Caste.save();
    $log.debug("Saved Caste", Caste);
    return Caste;
  }

  async update(id: string, CasteObj: Caste): Promise<Caste | null> {
    const Caste = await this.Caste.findById(id).exec();
    if (Caste) {
      Caste.name = CasteObj.name;
      Caste.status = CasteObj.status;

      await Caste.save();
      $log.debug("Updated Caste", Caste);
      return Caste;
    }

    return Caste;
  }

  async query(options = {}): Promise<Caste[]> {
    return this.Caste.find(options).exec();
  }

  async remove(id: string): Promise<Caste> {
    return await this.Caste.findById(id).remove().exec();
  }
}
