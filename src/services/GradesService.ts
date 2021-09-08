import { Service, Inject } from "@tsed/common";
import { EventEmitterService, OnEvent } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Grade } from "src/models/grades/Grades";
import { GradeSubject } from "src/models/grades/GradesSubjects";
import { Section } from "src/models/sections/Section";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

interface SubjectCreated {
  subject: GradeSubject["subject"];
  grade: GradeSubject["grade"];
}

interface SectionCreated {
  section: Section;
}

@Service()
export class GradesService {
  @Inject(Grade) private grade: MongooseModel<Grade>;
  @Inject() private eventEmitter: EventEmitterService;

  @OnEvent("subject.mapped", {})
  async addSubjects(event: SubjectCreated) {
    const grade = event.grade;
    await this.updateSubjects(grade.toString(), event.subject.toString());
  }

  @OnEvent("section.created", {})
  async addSections(event: SectionCreated) {
    const grade = event.section.grade;
    await this.updateSections(grade.toString(), [event.section._id.toString()]);
  }

  async find(id: Grade["_id"]): Promise<Grade | null> {
    const grade = await this.grade
      .findById(id)
      .populate("course")
      .populate("subjects")
      .populate("sections")
      .exec();
    return grade;
  }

  async save(data: Grade, user: EntityCreationUser): Promise<Grade> {
    const grade = new this.grade(data);
    await grade.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Grade" });
    return grade;
  }

  async update(id: string, data: Grade): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    if (grade) {
      grade.name = data.name;
      grade.status = data.status;
      grade.course = data.course;
      grade.sections = data.sections;
      grade.subjects = data.subjects;
      await grade.save();

      return grade;
    }

    return null;
  }

  async updateSubjects(id: string, subjectId: string): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    if (grade) {
      grade.subjects = grade.subjects
        ? [...grade.subjects, subjectId].filter((x) => x)
        : [subjectId];
      await grade.save();
      return grade;
    }

    return null;
  }

  async updateSections(
    id: string,
    sectionIds: string[]
  ): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    console.log("updateSections", id, sectionIds, grade);
    if (grade) {
      grade.sections = grade.sections
        ? [...grade.sections, ...sectionIds].filter((x) => x)
        : sectionIds;
      await grade.save();
    }

    return null;
  }

  async query(options = {}): Promise<Grade[]> {
    options = objectDefined(options);
    return this.grade
      .find(options)
      .populate("course")
      .populate("subjects")
      .populate("sections")
      .exec();
  }

  async remove(id: string): Promise<Grade> {
    return await this.grade.findById(id).remove().exec();
  }
}
