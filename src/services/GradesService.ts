import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Grade } from "src/models/grades/Grades";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class GradesService {
  @Inject(Grade) private Grade: MongooseModel<Grade>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Grade | null> {
    const Grade = await this.Grade.findById(id).exec();

    return Grade;
  }

  async save(data: Grade, user: EntityCreationUser): Promise<Grade> {
    const Grade = new this.Grade(data);
    await Grade.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Grade" });
    return Grade;
  }

  async update(id: string, data: Grade): Promise<Grade | null> {
    const Grade = await this.Grade.findById(id).exec();
    if (Grade) {
      Grade.name = data.name;
      Grade.status = data.status;
      Grade.courseId = data.courseId;
      Grade.sectionIds = data.sectionIds;
      await Grade.save();

      return Grade;
    }

    return Grade;
  }

  async query(options = {}): Promise<Grade[]> {
    options = objectDefined(options);
    return this.Grade.find(options).exec();
  }

  async remove(id: string): Promise<Grade> {
    return await this.Grade.findById(id).remove().exec();
  }
}
