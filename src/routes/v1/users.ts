import { DatabaseManager, IUser } from "../../database/DatabaseManager";
import { EndpointGroup } from "../../EndpointGroup";
import { LoggedInRequest, UserLoginInput, UserSignupInput } from "../../types";

export class UserEndpoints extends EndpointGroup {
  constructor(public db: DatabaseManager) {
    super(db);
    this.registerRoutes();
  }

  protected override registerRoutes(): void {
    this.router.get("/users/me", this.auth, (req: LoggedInRequest, res) => res.json());

    this.router.get("/users/:key/:value", this.auth, async (req: LoggedInRequest, res) => {
      let promise: Promise<IUser>;
      switch (req.params.key) {
        case "uuid":
          promise = this.db.find_user_by_uuid(req.params.uuid);
          break;
        case "username":
          promise = this.db.find_user_by_username(req.params.username);
          break;
        case "email":
          promise = this.db.find_user_by_email(req.params.email);
          break;
        default:
          promise = Promise.reject({ err: "Invalid user key" });
          break;
      }

      promise.then((user) => res.json(user)).catch((err) => res.status(400).json(err));
    });

    this.router.post<{}, {}, UserSignupInput>("/auth/signup", async (req, res) =>
      this.db
        .new_user(req.body)
        .then((result) => res.status(201).json(result))
        .catch((err) => res.status(400).json(err))
    );

    this.router.post<{}, {}, UserLoginInput>("/auth/login", async (req, res) =>
      this.db
        .login_user(req.body)
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(400).json(err))
    );
  }
}
