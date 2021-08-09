import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { Permission } from "src/models/users/Permission";

@Service()
export class PermissionsService {
  @Inject(Permission) private permission: MongooseModel<Permission>;

  //   $onInit() {
  //     this.seedPermissions();
  //   }

  //   async seedPermissions() {
  //     const permissions = await this.permission.find({});

  //     if (permissions.length === 0) {
  //       const promises = require("../../resources/permissions.json").map((permission: Permission) =>
  //         this.save(permission)
  //       );
  //       await Promise.all(promises);
  //     }
  //   }

  async find(id: string): Promise<Permission | null> {
    const permission = await this.permission.findById(id).exec();
    return permission;
  }

  async findOne(opts = {}): Promise<Permission | null> {
    const permission = await this.permission.findOne(opts).exec();
    return permission;
  }

  async save(permissionObj: Permission): Promise<Permission> {
    const permission = new this.permission(permissionObj);
    await permission.save();
    return permission;
  }

  async query(options = {}): Promise<Permission[]> {
    return this.permission.find(options).exec();
  }

  async remove(id: string): Promise<Permission> {
    return await this.permission.findById(id).remove().exec();
  }
}
