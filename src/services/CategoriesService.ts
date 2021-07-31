import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Category } from "src/models/categories/Category";

@Service()
export class CategoriesService {
  @Inject(Category) private category: MongooseModel<Category>;

  async find(id: string): Promise<Category | null> {
    const category = await this.category.findById(id).exec();
    $log.debug("Found category", category);
    return category;
  }

  async save(categoryObj: Category): Promise<Category> {
    const category = new this.category(categoryObj);
    await category.save();
    $log.debug("Saved category", category);
    return category;
  }

  async update(id: string, categoryObj: Category): Promise<Category | null> {
    const category = await this.category.findById(id).exec();
    if (category) {
      category.name = categoryObj.name;
      category.status = categoryObj.status;

      await category.save();
      $log.debug("Updated category", category);
      return category;
    }

    return category;
  }

  async query(options = {}): Promise<Category[]> {
    return this.category.find(options).exec();
  }

  async remove(id: string): Promise<Category> {
    return await this.category.findById(id).remove().exec();
  }
}
