import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Grade } from "src/models/grades/Grades";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class GradesService {
  @Inject(Grade) private grade: MongooseModel<Grade>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    return grade;
  }

  async save(data: Grade, user: EntityCreationUser): Promise<Grade> {
    const Grade = new this.grade(data);
    await Grade.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Grade" });
    return Grade;
  }

  async update(id: string, data: Grade): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    if (grade) {
      grade.name = data.name;
      grade.status = data.status;
      grade.courseId = data.courseId;
      grade.sectionIds = data.sectionIds;
      grade.subjectIds = data.subjectIds;
      await grade.save();

      return grade;
    }

    return null;
  }

  async query(options = {}): Promise<Grade[]> {
    options = objectDefined(options);
    return this.grade.find(options).exec();
  }

  async remove(id: string): Promise<Grade> {
    return await this.grade.findById(id).remove().exec();
  }
}
