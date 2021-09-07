import { Service, Inject } from "@tsed/common";
import { EventEmitterService, OnEvent } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import mongoose from "mongoose";
import { Grade } from "src/models/grades/Grades";
import { Section } from "src/models/sections/Section";
import { Subject } from "src/models/subjects/Subject";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

interface SubjectCreated {
  subject: Subject;
}

interface SectionCreated {
  section: Section;
}

@Service()
export class GradesService {
  @Inject(Grade) private grade: MongooseModel<Grade>;
  @Inject() private eventEmitter: EventEmitterService;

  @OnEvent("subject.created", {})
  async addSubjects(event: SubjectCreated) {
    const grade = event.subject.grade;
    await this.updateSubjects(grade.toString(), [
      event.subject.grade.toString(),
    ]);
  }

  @OnEvent("sections.created", {})
  async addSections(event: SectionCreated) {
    const grade = event.section.grade;
    await this.updateSections(grade.toString(), [
      event.section.grade.toString(),
    ]);
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

  async updateSubjects(
    id: string,
    subjectIds: string[]
  ): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    if (grade) {
      grade.subjects = grade.subjects
        ? [...grade.subjects, ...subjectIds].filter((x) => x)
        : subjectIds;
      await grade.save();
      return grade;
    }

    return null;
  }

  async updateSections(
    id: string,
    subjectIds: string[]
  ): Promise<Grade | null> {
    const grade = await this.grade.findById(id).exec();
    if (grade) {
      grade.sections = grade.sections
        ? [...grade.sections, ...subjectIds].filter((x) => x)
        : subjectIds;
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
