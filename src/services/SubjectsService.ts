import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Subject } from "src/models/subjects/Subject";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class SubjectsService {
  @Inject(Subject) private subject: MongooseModel<Subject>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Subject | null> {
    const subject = await this.subject.findById(id).populate("grade").exec();

    return subject;
  }

  async save(subjectObj: Subject, user: EntityCreationUser): Promise<Subject> {
    const subject = new this.subject(subjectObj);
    await subject.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Subject",
    });
    this.eventEmitter.emit("subject.created", {
      subject,
    });
    return subject;
  }

  async update(id: string, subjectObj: Subject): Promise<Subject | null> {
    const subject = await this.subject.findById(id).exec();
    if (subject) {
      if (subject.grade.toString() !== subjectObj.grade.toString()) {
        throw new Error(
          `Grade can't be updated. If required delete this and create new.`
        );
      }
      subject.name = subjectObj.name;
      subject.code = subjectObj.code;
      subject.type = subjectObj.type;
      subject.grade = subjectObj.grade;
      // subject.format = subjectObj.format;

      await subject.save();

      return subject;
    }

    return null;
  }

  async query(options = {}): Promise<Subject[]> {
    options = objectDefined(options);
    return this.subject.find(options).populate("grade").exec();
  }

  async remove(id: string): Promise<Subject> {
    return await this.subject.findById(id).remove().exec();
  }
}
