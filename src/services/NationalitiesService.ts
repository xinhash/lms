import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Nationality } from "src/models/nationalities/Nationality";

@Service()
export class NationalitiesService {
  @Inject(Nationality) private nationality: MongooseModel<Nationality>;

  async find(id: string): Promise<Nationality | null> {
    const nationality = await this.nationality.findById(id).exec();
    $log.debug("Found nationality", nationality);
    return nationality;
  }

  async save(nationalityObj: Nationality): Promise<Nationality> {
    const nationality = new this.nationality(nationalityObj);
    await nationality.save();
    $log.debug("Saved nationality", nationality);
    return nationality;
  }

  async update(
    id: string,
    nationalityObj: Nationality
  ): Promise<Nationality | null> {
    const nationality = await this.nationality.findById(id).exec();
    if (nationality) {
      nationality.name = nationalityObj.name;
      nationality.status = nationalityObj.status;

      await nationality.save();
      $log.debug("Updated nationality", nationality);
      return nationality;
    }

    return nationality;
  }

  async query(options = {}): Promise<Nationality[]> {
    return this.nationality.find(options).exec();
  }

  async remove(id: string): Promise<Nationality> {
    return await this.nationality.findById(id).remove().exec();
  }
}
