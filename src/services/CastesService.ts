import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Caste } from "src/models/castes/Caste";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class CastesService {
  @Inject(Caste) private caste: MongooseModel<Caste>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Caste | null> {
    const caste = await this.caste.findById(id).exec();

    return caste;
  }

  async save(casteObj: Caste, user: EntityCreationUser): Promise<Caste> {
    const caste = new this.caste(casteObj);
    await caste.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Caste" });
    return caste;
  }

  async update(id: string, casteObj: Caste): Promise<Caste | null> {
    const caste = await this.caste.findById(id).exec();
    if (caste) {
      caste.name = casteObj.name;
      caste.status = casteObj.status;
      await caste.save();
      return caste;
    }
    return null;
  }

  async query(options = {}): Promise<Caste[]> {
    options = objectDefined(options);
    return this.caste.find(options).exec();
  }

  async remove(id: string): Promise<Caste> {
    return await this.caste.findById(id).remove().exec();
  }
}
