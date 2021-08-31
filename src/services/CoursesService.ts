import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Course } from "src/models/courses/Course";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class CoursesService {
  @Inject(Course) private course: MongooseModel<Course>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Course | null> {
    const Course = await this.course.findById(id).exec();

    return Course;
  }

  async save(courseObj: Course, user: EntityCreationUser): Promise<Course> {
    const course = new this.course(courseObj);
    await course.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Course" });

    return course;
  }

  async update(id: string, courseObj: Course): Promise<Course | null> {
    const course = await this.course.findById(id).exec();
    if (course) {
      course.name = courseObj.name;
      course.status = courseObj.status;

      await course.save();

      return course;
    }

    return null;
  }

  async query(options = {}): Promise<Course[]> {
    options = objectDefined(options);
    return this.course.find(options).exec();
  }

  async remove(id: string): Promise<Course> {
    return await this.course.findById(id).remove().exec();
  }
}
