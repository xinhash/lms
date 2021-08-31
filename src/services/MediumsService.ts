import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Medium } from "src/models/mediums/Medium";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class MediumsService {
  @Inject(Medium) private medium: MongooseModel<Medium>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Medium | null> {
    const medium = await this.medium.findById(id).exec();
    return medium;
  }

  async save(mediumObj: Medium, user: EntityCreationUser): Promise<Medium> {
    const medium = new this.medium(mediumObj);
    await medium.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Medium" });
    return medium;
  }

  async update(id: string, mediumObj: Medium): Promise<Medium | null> {
    const medium = await this.medium.findById(id).exec();
    if (medium) {
      medium.name = mediumObj.name;
      medium.status = mediumObj.status;
      await medium.save();
      return medium;
    }

    return null;
  }

  async query(options = {}): Promise<Medium[]> {
    options = objectDefined(options);
    return this.medium.find(options).exec();
  }

  async remove(id: string): Promise<Medium> {
    return await this.medium.findById(id).remove().exec();
  }
}
