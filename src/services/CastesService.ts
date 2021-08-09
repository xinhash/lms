import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Caste } from "src/models/castes/Caste";

@Service()
export class CastesService {
  @Inject(Caste) private Caste: MongooseModel<Caste>;

  async find(id: string): Promise<Caste | null> {
    const Caste = await this.Caste.findById(id).exec();

    return Caste;
  }

  async save(casteObj: Caste): Promise<Caste> {
    const Caste = new this.Caste(casteObj);
    await Caste.save();

    return Caste;
  }

  async update(id: string, casteObj: Caste): Promise<Caste | null> {
    const Caste = await this.Caste.findById(id).exec();
    if (Caste) {
      Caste.name = casteObj.name;
      Caste.status = casteObj.status;

      await Caste.save();

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
