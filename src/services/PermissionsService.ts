import { Service, Inject } from "@tsed/common";
import { EventEmitterService, OnEvent } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { uniq } from "lodash";
import { Permission } from "src/models/users/Permission";
import { User } from "src/models/users/User";
import { objectDefined } from "src/utils";

export type EntityCreationUser = {
  role: User["role"];
  _id: User["_id"];
  adminId: User["adminId"];
};
interface UserCreated {
  user: EntityCreationUser;
  moduleName: string;
}
@Service()
export class PermissionsService {
  @Inject(Permission) private permission: MongooseModel<Permission>;
  @Inject() private eventEmitter: EventEmitterService;

  @OnEvent("entity.created", {})
  async addPermissionsToUser(event: UserCreated) {
    if (!["superadmin"].includes(event.user.role)) {
      // create own permissions
      const pm = await this.findOrInitialize({
        moduleName: event.moduleName,
        roleName: event.user.role,
        userId: event.user._id,
      });
      pm.readIds = uniq([event.user._id]);
      pm.updateIds = pm.readIds;
      pm.deleteIds = pm.readIds;
      pm.canCreate = event.user.role === "admin";
      pm.canDelete = event.user.role === "admin";
      await this.save(pm);
      //update admin permissions
      const adminPm = await this.findOne({ userId: event.user.adminId });
      if (adminPm) {
        adminPm.readIds = uniq([...adminPm.readIds, event.user._id]);
        adminPm.updateIds = uniq([...adminPm.updateIds, event.user._id]);
        adminPm.deleteIds = uniq([...adminPm.deleteIds, event.user._id]);
        await this.save(adminPm);
      }
    }
  }

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

  async findOrInitialize(
    permissionObj: Partial<Permission>
  ): Promise<Permission> {
    const permission =
      (await this.findOne({
        moduleName: permissionObj.moduleName,
        roleName: permissionObj.roleName,
        userId: permissionObj.userId,
      })) || new this.permission(permissionObj);
    return permission;
  }

  async query(options = {}): Promise<Permission[]> {
    options = objectDefined(options);
    return this.permission.find(options).exec();
  }

  async update(id: string, data: Permission): Promise<Permission | null> {
    const permission = await this.permission.findById(id).exec();
    if (permission) {
      permission.moduleName = data.moduleName;
      permission.roleName = data.roleName;
      permission.canCreate = data.canCreate;
      permission.canRead = data.canRead;
      permission.canUpdate = data.canUpdate;
      permission.canDelete = data.canDelete;
      await permission.save();
      return permission;
    }

    return permission;
  }

  async remove(id: string): Promise<Permission> {
    return await this.permission.findById(id).remove().exec();
  }
}
