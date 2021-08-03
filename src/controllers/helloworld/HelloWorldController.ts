import { Controller, Get } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { AcceptRoles } from "src/decorators/AcceptRoles";

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  get() {
    return "hello";
  }
}
