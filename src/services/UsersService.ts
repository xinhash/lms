import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "src/models/users/User";

@Service()
export class UsersService {
  @Inject(User) private user: MongooseModel<User>;

  async find(id: string): Promise<User | null> {
    const user = await this.user.findById(id).exec();
    $log.debug("Found user", user);
    return user;
  }

  async save(userObj: User): Promise<User> {
    const user = new this.user(userObj);
    await user.save();
    $log.debug("Saved user", user);
    return user;
  }

  async query(options = {}): Promise<User[]> {
    return this.user.find(options).exec();
  }

  async remove(id: string): Promise<User> {
    return await this.user.findById(id).remove().exec();
  }
}
