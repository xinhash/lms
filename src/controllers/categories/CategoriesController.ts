import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  Req,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Category } from "src/models/categories/Category";
import { CategoriesService } from "src/services/CategoriesService";

@Controller("/categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all categories")
  @Returns(200, Category)
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return category based on id")
  @Returns(200, Category)
  async getCategory(@PathParams("id") id: string): Promise<Category | null> {
    return this.categoriesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new category")
  @Returns(201, Category)
  async createCategory(
    @Req() request: Req,
    @Description("Category model")
    @BodyParams()
    @Required()
    data: Category
  ): Promise<Category> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.categoriesService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update category with id")
  @Status(201, { description: "Updated category", type: Category })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() category: Category
  ): Promise<Category | null> {
    return this.categoriesService.update(id, category);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a category")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
