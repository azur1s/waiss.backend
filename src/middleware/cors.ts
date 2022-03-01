import chalk from "chalk";
import express, { NextFunction } from "express";

export default async function (req: express.Request, res: express.Response, next: NextFunction) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  console.log(`Request from IP: ${chalk.cyan(req.headers["cf-connecting-ip"])}`);

  // Pass to next layer of middleware
  next();
}
