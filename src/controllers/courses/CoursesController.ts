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
import { Course } from "src/models/courses/Course";
import { CoursesService } from "src/services/CoursesService";

@Controller("/Courses")
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get("/")
  @Summary("Return all Courses")
  @Returns(200, Course)
  async getAllCategories(): Promise<Course[]> {
    return this.coursesService.query();
  }

  @Get("/:id")
  @Summary("Return Course based on id")
  @Returns(200, Course)
  async getCourse(@PathParams("id") id: string): Promise<Course | null> {
    return this.coursesService.find(id);
  }

  @Post("/")
  @Summary("Create new Course")
  @Returns(201, Course)
  async createCourse(
    @Description("Course model")
    @BodyParams()
    @Required()
    CourseObj: Course
  ): Promise<Course> {
    return this.coursesService.save(CourseObj);
  }

  @Put("/:id")
  @Summary("Update Course with id")
  @Status(201, { description: "Updated Course", type: Course })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Course: Course
  ): Promise<Course | null> {
    return this.coursesService.update(id, Course);
  }

  @Delete("/:id")
  @Summary("Remove a Course")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.coursesService.remove(id);
  }
}
