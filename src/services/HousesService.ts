import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { House } from "src/models/houses/House";
import { EventEmitterService } from "@tsed/event-emitter";
import { EntityCreationUser } from "./PermissionsService";
import { objectDefined } from "src/utils";

@Service()
export class HousesService {
  @Inject(House) private house: MongooseModel<House>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<House | null> {
    const house = await this.house.findById(id).exec();
    return house;
  }

  async save(houseObj: House, user: EntityCreationUser): Promise<House> {
    const house = new this.house(houseObj);
    await house.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "House" });
    return house;
  }

  async update(id: string, houseObj: House): Promise<House | null> {
    const house = await this.house.findById(id).exec();
    if (house) {
      house.name = houseObj.name;
      house.description = houseObj.description;
      house.status = houseObj.status;

      await house.save();

      return house;
    }

    return null;
  }

  async query(options = {}): Promise<House[]> {
    options = objectDefined(options);
    return this.house.find(options).exec();
  }

  async remove(id: string): Promise<House> {
    return await this.house.findById(id).remove().exec();
  }
}
