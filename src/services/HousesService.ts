import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { House } from "src/models/houses/House";

@Service()
export class HousesService {
  @Inject(House) private House: MongooseModel<House>;

  async find(id: string): Promise<House | null> {
    const House = await this.House.findById(id).exec();
    $log.debug("Found House", House);
    return House;
  }

  async save(HouseObj: House): Promise<House> {
    const House = new this.House(HouseObj);
    await House.save();
    $log.debug("Saved House", House);
    return House;
  }

  async update(id: string, HouseObj: House): Promise<House | null> {
    const House = await this.House.findById(id).exec();
    if (House) {
      House.name = HouseObj.name;
      House.description = HouseObj.description;
      House.status = HouseObj.status;

      await House.save();
      $log.debug("Updated House", House);
      return House;
    }

    return House;
  }

  async query(options = {}): Promise<House[]> {
    return this.House.find(options).exec();
  }

  async remove(id: string): Promise<House> {
    return await this.House.findById(id).remove().exec();
  }
}
