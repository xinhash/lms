import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Section } from "src/models/sections/Section";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class SectionsService {
  @Inject(Section) private section: MongooseModel<Section>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Section | null> {
    const section = await this.section.findById(id).exec();

    return section;
  }

  async save(sectionObj: Section, user: EntityCreationUser): Promise<Section> {
    const section = new this.section(sectionObj);
    await section.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "School",
    });
    return section;
  }

  async update(id: string, sectionObj: Section): Promise<Section | null> {
    const section = await this.section.findById(id).exec();
    if (section) {
      section.name = sectionObj.name;
      section.status = sectionObj.status;
      section.mediumId = sectionObj.mediumId;
      section.noOfStudents = sectionObj.noOfStudents;
      await section.save();

      return section;
    }

    return null;
  }

  async query(options = {}): Promise<Section[]> {
    options = objectDefined(options);
    return this.section.find(options).exec();
  }

  async remove(id: string): Promise<Section> {
    return await this.section.findById(id).remove().exec();
  }
}
