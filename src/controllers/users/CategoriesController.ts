import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
} from "@tsed/common";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { Category } from "src/models/categories/Category";
import { CategoriesService } from "src/services/CategoriesService";

@Controller("/categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get("/")
  @Summary("Return all categories")
  @Returns(200, Category)
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.query();
  }

  @Get("/:id")
  @Summary("Return school based on id")
  @Returns(200, Category)
  async getCategory(@PathParams("id") id: string): Promise<Category | null> {
    return this.categoriesService.find(id);
  }

  @Post("/")
  @Summary("Create new school")
  @Returns(201, Category)
  async createCategory(
    @Description("Category model") @BodyParams() @Required() schoolObj: Category
  ): Promise<Category> {
    return this.categoriesService.save(schoolObj);
  }

  @Put("/:id")
  @Summary("Update school with id")
  @Status(201, { description: "Updated school", type: Category })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() school: Category
  ): Promise<Category | null> {
    return this.categoriesService.update(id, school);
  }

  @Delete("/:id")
  @Summary("Remove a school")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
