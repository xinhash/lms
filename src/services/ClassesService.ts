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

  async save(ClassObj: Class): Promise<Class> {
    const Class = new this.Class(ClassObj);
    await Class.save();
    $log.debug("Saved Class", Class);
    return Class;
  }

  async update(id: string, ClassObj: Class): Promise<Class | null> {
    const Class = await this.Class.findById(id).exec();
    if (Class) {
      Class.name = ClassObj.name;
      Class.status = ClassObj.status;
      Class.courseId = ClassObj.courseId;
      Class.sectionIds = ClassObj.sectionIds;
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
