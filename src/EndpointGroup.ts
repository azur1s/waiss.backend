import express, { Router } from "express";
import { DatabaseManager } from "./database/DatabaseManager";
import { auth } from "./middleware/auth";

export class EndpointGroup {
  constructor(public db: DatabaseManager) {
    this.registerRoutes();
  }
  public router: Router = express.Router();
  public auth = auth(this.db);

  protected registerRoutes() {
    throw Error("method 'registerRoutes' not implemented");
  }

  public getRoutes() {
    return this.router;
  }
}
