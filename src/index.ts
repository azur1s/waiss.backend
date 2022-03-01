import chalk from "chalk";
import express, { Express } from "express";
import fs from "fs";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "./middleware/cors";
import { v1 } from "./routes/v1";

export interface BackendSettings {
  port: number;
  verbose: boolean;
  secure: boolean;
  mongoUrl: string;
}

export class Backend implements BackendSettings {
  public express: Express = express().use(cors).use(morgan("dev")).use(express.json()).use(v1);
  public port: number;
  public verbose: boolean;
  public secure: boolean;
  public mongoUrl: string;
  public server: http.Server | https.Server;

  private constructor(settings: BackendSettings) {
    this.port = settings.port;
    this.verbose = settings.verbose;
    this.mongoUrl = settings.mongoUrl;
    this.secure = settings.secure;
    this.server = this.secure
      ? https.createServer(
          {
            key: fs.readFileSync("./key.pem"),
            cert: fs.readFileSync("./cert.pem"),
          },
          this.express
        )
      : http.createServer(this.express);
  }

  public static async create(settings: BackendSettings) {
    const server = new this(settings);
    await server.connectDatabase();
    server.listen();
    return server;
  }

  private async connectDatabase() {
    console.log(`Connecting to MongoDB...`);
    return mongoose
      .connect(this.mongoUrl, { appName: "Stemless Backend" })
      .then(() => this.verbose && console.log("MongoDB Connected"))
      .catch((reason) => {
        this.verbose && console.log("MongoDB failed to connect, reason: ", reason);
        process.exit(1);
      });
  }

  private listen() {
    this.server.listen(this.port, () => this.verbose && console.log(`[INDEX] Started on port ${this.port.toString()}`));
  }
}
