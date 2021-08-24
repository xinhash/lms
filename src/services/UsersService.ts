import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "src/models/users/User";
import { EventEmitterService } from "@tsed/event-emitter";
import { objectDefined } from "src/utils";
import { Student } from "src/models/users/Student";

@Service()
export class UsersService {
  @Inject(User) private user: MongooseModel<User>;
  @Inject(Student) private student: MongooseModel<Student>;
  @Inject() private eventEmitter: EventEmitterService;

  $onInit() {
    this.seedUsers();
  }

  async seedUsers() {
    const users = await this.user.find({});

    if (users.length === 0) {
      const promises = require("../../resources/user.json").map((user: User) =>
        this.save(user)
      );
      await Promise.all(promises);
    }
  }

  async find(id: string): Promise<User | null> {
    const user = await this.user.findById(id).exec();

    return user;
  }

  async findOne(opts = {}): Promise<User | null> {
    const user = await this.user.findOne(opts).exec();

    return user;
  }

  async save(userObj: User): Promise<User> {
    const user = new this.user(userObj);
    await user.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "User" });
    if (user.role === "student") {
      const student = new this.student({
        user: user._id,
      });
      await student.save();
    }
    return user;
  }

  async query(options = {}): Promise<User[]> {
    options = objectDefined(options);

    return this.user.find(options).exec();
  }

  async remove(id: string): Promise<User> {
    return await this.user.findById(id).remove().exec();
  }

  attachToken(user: User, token: string) {
    user.token = token;
  }
}
