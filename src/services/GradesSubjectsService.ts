import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { EventEmitterService } from "@tsed/event-emitter";
import { EntityCreationUser } from "./PermissionsService";
import { objectDefined } from "src/utils";
import { GradeSubject } from "src/models/grades/GradesSubjects";

@Service()
export class GradeSubjectServices {
  @Inject(GradeSubject) private gradeSubject: MongooseModel<GradeSubject>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<GradeSubject | null> {
    const gradeSubject = await this.gradeSubject.findById(id).exec();
    return gradeSubject;
  }

  async save(
    gradeSubjectObj: GradeSubject,
    user: EntityCreationUser
  ): Promise<GradeSubject> {
    const gradeSubject = new this.gradeSubject(gradeSubjectObj);
    await gradeSubject.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "GradeSubject",
    });
    this.eventEmitter.emit("subject.mapped", {
      subject: gradeSubject.subject,
      grade: gradeSubject.grade,
    });
    return gradeSubject;
  }

  async update(
    id: string,
    gradeSubjectObj: GradeSubject
  ): Promise<GradeSubject | null> {
    const gradeSubject = await this.gradeSubject.findById(id).exec();
    if (gradeSubject) {
      gradeSubject.grade = gradeSubjectObj.grade;
      gradeSubject.subject = gradeSubjectObj.subject;
      gradeSubject.format = gradeSubjectObj.format;

      await gradeSubject.save();

      return gradeSubject;
    }

    return null;
  }

  async query(options = {}): Promise<GradeSubject[]> {
    options = objectDefined(options);
    return this.gradeSubject.find(options).exec();
  }

  async remove(id: string): Promise<GradeSubject> {
    return await this.gradeSubject.findById(id).remove().exec();
  }
}
