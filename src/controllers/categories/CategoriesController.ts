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
import {
  Description,
  Groups,
  Required,
  Returns,
  Status,
  Summary,
} from "@tsed/schema";
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
  async getAllCategories(@Req() request: Req): Promise<Category[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.categoriesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return category based on id")
  @Returns(200, Category)
  async getCategory(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Category | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
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
    @Groups("creation")
    data: Category
  ): Promise<Category> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.categoriesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
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
