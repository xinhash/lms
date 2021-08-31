import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Nationality } from "src/models/nationalities/Nationality";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class NationalitiesService {
  @Inject(Nationality) private nationality: MongooseModel<Nationality>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Nationality | null> {
    const nationality = await this.nationality.findById(id).exec();

    return nationality;
  }

  async save(
    nationalityObj: Nationality,
    user: EntityCreationUser
  ): Promise<Nationality> {
    const nationality = new this.nationality(nationalityObj);
    await nationality.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Nationality",
    });
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

      return nationality;
    }

    return null;
  }

  async query(options = {}): Promise<Nationality[]> {
    options = objectDefined(options);
    return this.nationality.find(options).exec();
  }

  async remove(id: string): Promise<Nationality> {
    return await this.nationality.findById(id).remove().exec();
  }
}
