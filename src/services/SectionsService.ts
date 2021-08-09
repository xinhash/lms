import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Section } from "src/models/sections/Section";

@Service()
export class SectionsService {
  @Inject(Section) private Section: MongooseModel<Section>;

  async find(id: string): Promise<Section | null> {
    const Section = await this.Section.findById(id).exec();

    return Section;
  }

  async save(sectionObj: Section): Promise<Section> {
    const Section = new this.Section(sectionObj);
    await Section.save();

    return Section;
  }

  async update(id: string, sectionObj: Section): Promise<Section | null> {
    const Section = await this.Section.findById(id).exec();
    if (Section) {
      Section.name = sectionObj.name;
      Section.status = sectionObj.status;
      Section.mediumId = sectionObj.mediumId;
      Section.noOfStudents = sectionObj.noOfStudents;
      await Section.save();

      return Section;
    }

    return Section;
  }

  async query(options = {}): Promise<Section[]> {
    return this.Section.find(options).exec();
  }

  async remove(id: string): Promise<Section> {
    return await this.Section.findById(id).remove().exec();
  }
}
