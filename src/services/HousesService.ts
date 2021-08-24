import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { House } from "src/models/houses/House";
import { EventEmitterService } from "@tsed/event-emitter";
import { EntityCreationUser } from "./PermissionsService";
import { objectDefined } from "src/utils";

@Service()
export class HousesService {
  @Inject(House) private House: MongooseModel<House>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<House | null> {
    const House = await this.House.findById(id).exec();

    return House;
  }

  async save(houseObj: House, user: EntityCreationUser): Promise<House> {
    const House = new this.House(houseObj);
    await House.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "House" });
    return House;
  }

  async update(id: string, houseObj: House): Promise<House | null> {
    const House = await this.House.findById(id).exec();
    if (House) {
      House.name = houseObj.name;
      House.description = houseObj.description;
      House.status = houseObj.status;

      await House.save();

      return House;
    }

    return House;
  }

  async query(options = {}): Promise<House[]> {
    options = objectDefined(options);
    return this.House.find(options).exec();
  }

  async remove(id: string): Promise<House> {
    return await this.House.findById(id).remove().exec();
  }
}
