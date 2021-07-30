import { Catch, ExceptionFilterMethods, PlatformContext } from "@tsed/common";
import { PassportException } from "@tsed/passport";

@Catch(PassportException)
export class PassportExceptionFilter implements ExceptionFilterMethods {
  async catch(exception: PassportException, ctx: PlatformContext) {
    const { response } = ctx;

    console.log(exception.name);
  }
}
