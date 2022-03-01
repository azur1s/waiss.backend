import express, { Router } from "express";
import auth from "../../middleware/auth";
import { createUser, getUser, getUsers, loginUser } from "../../services/user.service";
import { MachineDocument, MachineObject } from "../../types/machine";
import {
  LoggedInRequest,
  UserDocument,
  UserLoginInput,
  UserLoginResultSafe,
  UserObject,
  UserSignupInput,
  UserSignupResultSafe,
} from "../../types/user";
import { Validators } from "../../utils/validators";

export const users: Router = express.Router();

users.get<{}, UserObject>("/users/me", auth, (req: LoggedInRequest, res) => res.json(cleanUser(req.user!)));

users.get<{ uuid: string }, UserObject>("/users/uuid/:uuid", auth, async (req: LoggedInRequest, res) =>
  res.json(cleanUser(await getUser({ uuid: req.params.uuid })))
);

users.post<{}, UserSignupResultSafe | { error: string }, UserSignupInput>("/auth/signup", async (req, res) =>
  createUser(req.body).then(
    ({ user, token }) => res.status(201).json({ user: cleanUser(user), token }),
    (reason) => res.status(400).json({ error: reason })
  )
);

users.post<{}, UserLoginResultSafe | { error: string }, UserLoginInput>("/auth/login", async (req, res) =>
  loginUser(req.body).then(
    ({ user, token }) => res.status(200).json({ user: cleanUser(user), token }),
    (reason) => res.status(400).json({ error: reason })
  )
);
