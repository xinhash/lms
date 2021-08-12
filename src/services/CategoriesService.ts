import { Service, Inject, $log } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Category } from "src/models/categories/Category";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class CategoriesService {
  @Inject(Category) private category: MongooseModel<Category>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Category | null> {
    const category = await this.category.findById(id).exec();

    return category;
  }

  async save(
    categoryObj: Category,
    user: EntityCreationUser
  ): Promise<Category> {
    const category = new this.category(categoryObj);
    await category.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Category" });
    return category;
  }

  async update(id: string, categoryObj: Category): Promise<Category | null> {
    const category = await this.category.findById(id).exec();
    if (category) {
      category.name = categoryObj.name;
      category.status = categoryObj.status;

      await category.save();

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
