import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Course } from "src/models/courses/Course";

@Service()
export class CoursesService {
  @Inject(Course) private Course: MongooseModel<Course>;

  async find(id: string): Promise<Course | null> {
    const Course = await this.Course.findById(id).exec();
    $log.debug("Found Course", Course);
    return Course;
  }

  async save(CourseObj: Course): Promise<Course> {
    const Course = new this.Course(CourseObj);
    await Course.save();
    $log.debug("Saved Course", Course);
    return Course;
  }

  async update(id: string, CourseObj: Course): Promise<Course | null> {
    const Course = await this.Course.findById(id).exec();
    if (Course) {
      Course.name = CourseObj.name;
      Course.status = CourseObj.status;

      await Course.save();
      $log.debug("Updated Course", Course);
      return Course;
    }

    return Course;
  }

  async query(options = {}): Promise<Course[]> {
    return this.Course.find(options).exec();
  }

  async remove(id: string): Promise<Course> {
    return await this.Course.findById(id).remove().exec();
  }
}
