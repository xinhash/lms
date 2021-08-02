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
import { House } from "src/models/houses/House";
import { HousesService } from "src/services/HousesService";

@Controller("/houses")
export class HousesController {
  constructor(private housesService: HousesService) {}

  @Get("/")
  @Summary("Return all Houses")
  @Returns(200, House)
  async getAllHouses(): Promise<House[]> {
    return this.housesService.query();
  }

  @Get("/:id")
  @Summary("Return House based on id")
  @Returns(200, House)
  async getHouse(@PathParams("id") id: string): Promise<House | null> {
    return this.housesService.find(id);
  }

  @Post("/")
  @Summary("Create new House")
  @Returns(201, House)
  async createHouse(
    @Description("House model")
    @BodyParams()
    @Required()
    HouseObj: House
  ): Promise<House> {
    return this.housesService.save(HouseObj);
  }

  @Put("/:id")
  @Summary("Update House with id")
  @Status(201, { description: "Updated House", type: House })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() House: House
  ): Promise<House | null> {
    return this.housesService.update(id, House);
  }

  @Delete("/:id")
  @Summary("Remove a House")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.housesService.remove(id);
  }
}
