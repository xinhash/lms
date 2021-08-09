import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Grade } from "src/models/grades/Grades";

@Service()
export class GradesService {
  @Inject(Grade) private Grade: MongooseModel<Grade>;

  async find(id: string): Promise<Grade | null> {
    const Grade = await this.Grade.findById(id).exec();

    return Grade;
  }

  async save(data: Grade): Promise<Grade> {
    const Grade = new this.Grade(data);
    await Grade.save();

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
    return this.Grade.find(options).exec();
  }

  async remove(id: string): Promise<Grade> {
    return await this.Grade.findById(id).remove().exec();
  }
}
