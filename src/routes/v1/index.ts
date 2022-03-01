import express, { Router } from "express";
import { users } from "./users";

export const v1: Router = express.Router();

const HELLO_WORLD = JSON.stringify({
  message: "Hello World",
});

v1.get("/", async (req, res) => res.send(HELLO_WORLD));
v1.get("/ping", async (req, res) => res.send());
v1.use("/users", users);
