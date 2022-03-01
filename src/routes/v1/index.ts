import { DatabaseManager } from "../../database/DatabaseManager";
import { UserEndpoints } from "./users";
import { EndpointGroup } from "../../EndpointGroup";

export class v1 extends EndpointGroup {
  constructor(public db: DatabaseManager) {
    super(db);
  }

  protected override registerRoutes(): void {
    this.router.get("/", async (req, res) =>
      res.send({
        message: "Hello World",
      })
    );
    this.router.get("/ping", async (req, res) => res.send());
    this.router.use("/users", new UserEndpoints(this.db).getRoutes());
  }
}
