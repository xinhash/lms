import { Service, Inject } from "@tsed/common";
import { EventEmitterService, OnEvent } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { School } from "src/models/schools/School";
import { Session } from "src/models/sessions/Session";
import { generateSessions, objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

interface SchoolCreated {
  school: School;
  user: EntityCreationUser
}

@Service()
export class SessionsService {
  @Inject(Session) private Session: MongooseModel<Session>;
  @Inject() private eventEmitter: EventEmitterService;

  @OnEvent("school.created", {})
  async createSchoolSessions({school, user}: SchoolCreated) {
    const sessions = generateSessions(school.startedAt)
    await Promise.all(sessions.map(session => this.save({
        schoolId: school._id,
        name: session
      }, user)))
  }

  async find(id: string): Promise<Session | null> {
    const session = await this.Session.findById(id).exec();

    return session;
  }

  async save(sessionObj: Session, user: EntityCreationUser): Promise<Session> {
    const session = new this.Session(sessionObj);
    await session.save();
    this.eventEmitter.emit("entity.created", {
      user,
      moduleName: "Session",
    });
    return session;
  }

  async update(id: string, sessionObj: Session): Promise<Session | null> {
    const session = await this.Session.findById(id).exec();
    if (session) {
      session.description = sessionObj.description;
      await session.save();

      return session;
    }

    return session;
  }

  async query(options = {}): Promise<Session[]> {
    options = objectDefined(options);
    return this.Session.find(options).exec();
  }

  async remove(id: string): Promise<Session> {
    return await this.Session.findById(id).remove().exec();
  }
}
