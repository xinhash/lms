import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Course } from "src/models/courses/Course";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class CoursesService {
  @Inject(Course) private Course: MongooseModel<Course>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Course | null> {
    const Course = await this.Course.findById(id).exec();

    return Course;
  }

  async save(courseObj: Course, user: EntityCreationUser): Promise<Course> {
    const Course = new this.Course(courseObj);
    await Course.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Course" });

    return Course;
  }

  async update(id: string, courseObj: Course): Promise<Course | null> {
    const Course = await this.Course.findById(id).exec();
    if (Course) {
      Course.name = courseObj.name;
      Course.status = courseObj.status;

      await Course.save();

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
