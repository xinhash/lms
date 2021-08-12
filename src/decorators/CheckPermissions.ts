import { UseBefore } from "@tsed/common";
import { useDecorators, StoreSet } from "@tsed/core";
import { PermissionsMiddleware } from "src/middlewares/PermissionsMiddleware";

export function CheckPermissions(moduleName: string) {
  return useDecorators(
    StoreSet(PermissionsMiddleware, moduleName),
    UseBefore(PermissionsMiddleware)
  );
}
