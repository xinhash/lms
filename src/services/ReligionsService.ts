import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Religion } from "src/models/religions/Religion";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class ReligionsService {
  @Inject(Religion) private religion: MongooseModel<Religion>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Religion | null> {
    const religion = await this.religion.findById(id).exec();

    return religion;
  }

  async save(
    religionObj: Religion,
    user: EntityCreationUser
  ): Promise<Religion> {
    const religion = new this.religion(religionObj);
    await religion.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Religion",
    });
    return religion;
  }

  async update(id: string, religionObj: Religion): Promise<Religion | null> {
    const religion = await this.religion.findById(id).exec();
    if (religion) {
      religion.name = religionObj.name;
      religion.status = religionObj.status;

      await religion.save();

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
