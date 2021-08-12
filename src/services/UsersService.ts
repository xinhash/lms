import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "src/models/users/User";
import { EventEmitterService } from "@tsed/event-emitter";
import { pickBy } from "lodash";

@Service()
export class UsersService {
  @Inject(User) private user: MongooseModel<User>;
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
    return user;
  }

  async query(options = {}): Promise<User[]> {
    options = pickBy(options, (v) => ![undefined, null].includes(v));

    return this.user.find(options).exec();
  }

  async remove(id: string): Promise<User> {
    return await this.user.findById(id).remove().exec();
  }

  attachToken(user: User, token: string) {
    user.token = token;
  }
}
