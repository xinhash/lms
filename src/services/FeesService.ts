import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Fee } from "src/models/fees/Fee";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class FeesService {
  @Inject(Fee) private fee: MongooseModel<Fee>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Fee | null> {
    const Fee = await this.fee
      .findById(id)
      .populate("school")
      .populate("grade")
      .populate("medium")
      .populate("session")
      .exec();
    return Fee;
  }

  async save(data: Fee, user: EntityCreationUser): Promise<Fee> {
    const Fee = new this.fee(data);
    await Fee.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return Fee;
  }

  async update(id: string, data: Fee): Promise<Fee | null> {
    const Fee = await this.fee.findById(id).exec();
    if (Fee) {
      Fee.school = data.school;
      Fee.grade = data.grade;
      Fee.medium = data.medium;
      Fee.info = data.info;
      Fee.status = data.status;
      await Fee.save();
    }
    return null;
  }

  async query(options = {}): Promise<Fee[]> {
    options = objectDefined(options);
    return this.fee
      .find(options)
      .populate("school")
      .populate("grade")
      .populate("medium")
      .populate("session")
      .exec();
  }

  async remove(id: string): Promise<Fee> {
    return await this.fee.findById(id).remove().exec();
  }
}
