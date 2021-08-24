import { User } from "./models/users/User";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type Permissions = {
  readIds: string[];
  updateIds: string[];
  deleteIds: string[];
};

// declare module "mongoose-findorcreate";
declare global {
  namespace Express {
    interface Request {
      permissions: AtLeastOne<Permissions>;
    }
  }
}
