import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Class } from "src/models/classes/Classes";

@Service()
export class ClassesService {
  @Inject(Class) private Class: MongooseModel<Class>;

  async find(id: string): Promise<Class | null> {
    const Class = await this.Class.findById(id).exec();
    $log.debug("Found Class", Class);
    return Class;
  }

  async save(classObj: Class): Promise<Class> {
    const Class = new this.Class(classObj);
    await Class.save();
    $log.debug("Saved Class", Class);
    return Class;
  }

  async update(id: string, classObj: Class): Promise<Class | null> {
    const Class = await this.Class.findById(id).exec();
    if (Class) {
      Class.name = classObj.name;
      Class.status = classObj.status;
      Class.courseId = classObj.courseId;
      Class.sectionIds = classObj.sectionIds;
      await Class.save();
      $log.debug("Updated Class", Class);
      return Class;
    }

    return Class;
  }

  async query(options = {}): Promise<Class[]> {
    return this.Class.find(options).exec();
  }

  async remove(id: string): Promise<Class> {
    return await this.Class.findById(id).remove().exec();
  }
}
