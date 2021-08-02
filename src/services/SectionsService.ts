import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Section } from "src/models/sections/Section";

@Service()
export class SectionsService {
  @Inject(Section) private Section: MongooseModel<Section>;

  async find(id: string): Promise<Section | null> {
    const Section = await this.Section.findById(id).exec();
    $log.debug("Found Section", Section);
    return Section;
  }

  async save(SectionObj: Section): Promise<Section> {
    const Section = new this.Section(SectionObj);
    await Section.save();
    $log.debug("Saved Section", Section);
    return Section;
  }

  async update(id: string, SectionObj: Section): Promise<Section | null> {
    const Section = await this.Section.findById(id).exec();
    if (Section) {
      Section.name = SectionObj.name;
      Section.status = SectionObj.status;
      Section.mediumId = SectionObj.mediumId;
      Section.noOfStudents = SectionObj.noOfStudents;
      await Section.save();
      $log.debug("Updated Section", Section);
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
