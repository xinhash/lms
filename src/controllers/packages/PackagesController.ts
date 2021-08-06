import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Package } from "src/models/packages/Package";
import { PackagesService } from "src/services/PackagesService";

@Controller("/packages")
export class CastesController {
  constructor(private packagesService: PackagesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Packages")
  @Returns(200, Package)
  async getAllCastes(): Promise<Package[]> {
    return this.packagesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Package based on id")
  @Returns(200, Package)
  async getCaste(@PathParams("id") id: string): Promise<Package | null> {
    return this.packagesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("superadmin", "admin")
  @Summary("Create new Package")
  @Returns(201, Package)
  async createCaste(
    @Description("Package model")
    @BodyParams()
    @Required()
    data: Package
  ): Promise<Package> {
    return this.packagesService.save(data);
  }

  @Put("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Package with id")
  @Status(201, { description: "Updated Package", type: Package })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Package: Package
  ): Promise<Package | null> {
    return this.packagesService.update(id, Package);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Package")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.packagesService.remove(id);
  }
}
