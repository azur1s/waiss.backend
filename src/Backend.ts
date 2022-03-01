import express, { Express } from "express";
import fs from "fs";
import http from "http";
import https from "https";
import morgan from "morgan";
import { DatabaseManager } from "./database/DatabaseManager";
import cors from "./middleware/cors";
import { v1 } from "./routes/v1";

export class Backend {
  public express: Express = express()
    .use(cors)
    .use(morgan("dev"))
    .use(express.json())
    .use("/v1", new v1(this.db).getRoutes());
  public server: http.Server | https.Server;

  private constructor(public db: DatabaseManager) {
    this.server =
      process.env.SECURE! === "true"
        ? https.createServer(
            {
              key: fs.readFileSync("./key.pem"),
              cert: fs.readFileSync("./cert.pem"),
            },
            this.express
          )
        : http.createServer(this.express);
  }

  public static async create() {
    const db = await DatabaseManager.new(process.env.DATABASE_URL!, process.env.APP_NAME!, process.env.DATABASE_NAME!);
    const self = new this(db);
    await db.connectDatabase();
    self.listen();
    return self;
  }

  private listen() {
    const port = parseFloat(process.env.PORT!);
    this.server.listen(port, () => console.log(`[INDEX] Started on port http://localhost:${port}`));
  }
}
