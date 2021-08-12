import { Service, Inject } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Role } from "src/models/users/Role";

@Service()
export class RolesService {
  @Inject(Role) private role: MongooseModel<Role>;

  $onInit() {
    this.seedRoles();
  }

  async seedRoles() {
    const roles = await this.role.find({});

    if (roles.length === 0) {
      const promises = require("../../resources/roles.json").map((role: Role) =>
        this.save(role)
      );
      await Promise.all(promises);
    }
  }

  async find(id: string): Promise<Role | null> {
    const role = await this.role.findById(id).exec();
    return role;
  }

  async findOne(opts = {}): Promise<Role | null> {
    const role = await this.role.findOne(opts).exec();
    return role;
  }

  async save(roleObj: Role): Promise<Role> {
    const role = new this.role(roleObj);
    await role.save();
    return role;
  }

  async query(options = {}): Promise<Role[]> {
    return this.role.find(options).exec();
  }

  async update(id: string, data: Role): Promise<Role | null> {
    const role = await this.role.findById(id).exec();
    if (role) {
      role.name = data.name;
      await role.save();
      return role;
    }

    return role;
  }

  async remove(id: string): Promise<Role> {
    return await this.role.findById(id).remove().exec();
  }
}
