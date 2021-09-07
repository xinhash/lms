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
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Category } from "src/models/categories/Category";
import { CategoriesService } from "src/services/CategoriesService";
import { UsersService } from "src/services/UsersService";

@Controller("/categories")
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
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
  @Security("oauth_jwt")
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
  @Security("oauth_jwt")
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
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.categoriesService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update category with id")
  @Status(201, { description: "Updated category", type: Category })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() category: Category
  ): Promise<Category | null> {
    return this.categoriesService.update(id, category);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a category")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
