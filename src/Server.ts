import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/passport";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import "@tsed/event-emitter"; // import event emitter ts.ed module
import { config, rootDir } from "./config";
import { IndexCtrl } from "./controllers/pages/IndexController";
import { User } from "./models/users/User";
import path from "path";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/api/v1": [`${rootDir}/controllers/**/*.ts`],
    "/": [IndexCtrl],
  },
  componentsScan: [
    `${rootDir}/middlewares/*.ts`, // scan protocols directory
    `${rootDir}/protocols/*.ts`, // scan protocols directory
  ],
  swagger: [
    {
      path: "/v2/docs",
      specVersion: "2.0",
    },
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    },
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs",
  },
  exclude: ["**/*.spec.ts"],
  passport: {
    userInfoModel: User,
  },
  eventEmitter: {
    enabled: true, // Enable events for this instance.
    // pass any options that you would normally pass to new EventEmitter2(), e.g.
    wildcard: true,
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      ); // @ts-ignore
  }
}
