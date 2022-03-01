import mongoose, { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { UserLoginResult, UserSignupInput } from "../types";
import { commentSchema, projectHistorySchema, projectSchema, userSchema } from "./schemas";
import jwt from "jsonwebtoken";
import { Validators } from "../validators";
import { MongoServerError } from "mongodb";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  avatar: string; // The avatar url of the user
  uuid: string; // The uuid of the user
  username: string; // The username of the user
  email: string; // The email of the user
  password: string; // The user's hashed password
  created_at: number; // The time the user was created
  updated_at: number; // The modification date of the user
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  updateAvatar: (newValue: string) => Promise<IUser>;
  updatePassword: (newValue: string) => Promise<IUser>;
  updateEmail: (newValue: string) => Promise<IUser>;
  updateUsername: (newValue: string) => Promise<IUser>;
}

export interface IProject {
  name: string; // Name of the project (obviously trol)
  daw_name: string; // The name of the DAW
  version: number; // The current version of the project (history count)
  updated_at: number; // Epoch date of when it was last updated
  users: string[]; // List of UUIDs of users who have access to this project
  history: IProjectHistory[]; // The project's history
  cover_art?: string; // The optional path to cover art of the project
  owner: string; // The UUID of the owner of this project
  is_finished: boolean; // If this project is finished (complete)
  private: boolean; // If this project is private
}

export interface IProjectPlugin {
  name: string; // The name of the plugin
  version: string; // Version of the plugin
  arch: number; // 32 or 64 (bit)
  vst_version: string; // The VST version (2.x / 3.x) of the plugin
}

export interface IProjectHistory {
  uuid: string; // A unique specifier for the history item so we can tell histories apart
  daw_version: string; // The current version of the DAW
  created_at: number; // Epoch date of the when this project was started
  plugin_count: number; // The total plugins in this project
  track_count?: number; // The total tracks in this project
  plugins: IProjectPlugin; // The list of the plugins used in the project
  committees: string[]; // A list of UUIDs of the users who committed this version
  summary: string; // Notes about the version
  path: string; // The path of where the project files are located in the cdn
  comments: Comment[]; // A list of comments
  render_preview_url?: string; // The render preview url
}

export interface IComment {
  uuid: string; // A unique specifier for the comment so we can tell comments apart
  content: string; // The content of the comment
  created_at: number; // Epoch date of the when this comment was created
  updated_at: number; // Epoch date of the when this comment was last updated
}

const preSaveMiddleware = async function <
  T extends { isNew: boolean; created_at: number; updated_at: number; uuid: string }
>(this: T, next: Function) {
  if (this.isNew) {
    this.created_at = Date.now();
    this.uuid = uuidv4();
  }

  this.updated_at = Date.now();
  console.log(`Middleware updated at: ${this.created_at}`);

  return next();
};

/**
 * Database handler class
 * @class DatabaseManager
 */
export class DatabaseManager {
  private userSchema = userSchema;
  private projectSchema = projectSchema;
  private commentSchema = commentSchema;
  private projectHistorySchema = projectHistorySchema;
  static server: any;

  constructor(public database_url: string, public app_name: string, public database_name: string) {
    this.userSchema.pre("save", preSaveMiddleware);
    this.projectSchema.pre("save", preSaveMiddleware);
    this.commentSchema.pre("save", preSaveMiddleware);
    this.projectHistorySchema.pre("save", preSaveMiddleware);

    this.userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password).catch(() => false);
    };
  }

  public users = mongoose.model<IUser>("User", this.userSchema);
  public projects = mongoose.model<IProject>("Project", this.projectSchema);
  public comments = mongoose.model<IComment>("Comment", this.commentSchema);
  public project_histories = mongoose.model<IProjectHistory>("Project History", this.projectHistorySchema);

  /**
   * Creates a new database manager
   * @param database_url The database servers url to connect to
   * @param app_name the name of the app for the mongodb client
   * @param database_name The name of the database to connect to
   * @returns The new database manager
   */
  public static async new(database_url: string, app_name: string, database_name: string): Promise<DatabaseManager> {
    const self = new this(database_url, app_name, database_name);
    return self;
  }

  /**
   * Connects to the MongoDB
   */
  public async connectDatabase() {
    console.log(`Connecting to MongoDB...`);
    return mongoose
      .connect(this.database_url, { appName: this.app_name })
      .then(() => console.log("MongoDB Connected"))
      .catch((reason) => {
        console.log("MongoDB failed to connect, reason: ", reason);
        process.exit(1);
      });
  }

  /**
   * Creates a new user in the database
   */
  public async new_user(form: UserSignupInput) {
    if (!Validators.validateEmail(form.email)) return Promise.reject("email doesn't meet complexity requirements");
    if (!Validators.validatePassword(form.password)) return Promise.reject("password doesn't meet complexity requirements");
    if (!Validators.validateUsername(form.username)) return Promise.reject("username doesn't meet complexity requirements");

    try {
      const user = await this.users.create<UserSignupInput>(form);
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET!);
      return { user, token };
    } catch (error) {
      if (error instanceof MongoServerError) {
        switch (error.code) {
          case 11000:
            return Promise.reject(`a user with this ${Object.keys(error.keyValue)[0].toLowerCase()} already exists`);
        }
      }
      return Promise.reject(error);
    }
  }
  /**
   * Attempts to login a user
   */
  public async login_user({ username, password }: { username: string; password: string }): Promise<UserLoginResult> {
    if (!Validators.validatePassword(password)) return Promise.reject("password doesn't meet complexity requirements");
    if (!Validators.validateUsername(username)) return Promise.reject("username doesn't meet complexity requirements");

    const user = await this.find_user_by_username(username);

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET!);
      return { user, token };
    }

    return Promise.reject("invalid credentials");
  }

  /**
   * Finds a user by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The user object if found, null otherwise
   */
  private async find_user_by_field(field_name: string, field_value: string, safe: boolean = false): Promise<IUser> {
    return (await this.users.findOne({ [field_name]: field_value })) ?? Promise.reject("user.notFound");
  }

  /**
   * Finds a project by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The project object if found, null otherwise
   */
  private async find_project_by_field(field_name: string, field_value: string, safe?: boolean): Promise<IProject> {
    return (await this.projects.findOne({ [field_name]: field_value })) ?? Promise.reject("project.notFound");
  }

  /**
   * Finds a comment by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The comment object if found, null otherwise
   */
  private async find_comment_by_field(field_name: string, field_value: string, safe?: boolean): Promise<IComment> {
    return (await this.comments.findOne({ [field_name]: field_value })) ?? Promise.reject("comment.notFound");
  }

  /**
   * Finds a user by the specified user UUID
   * @param uuid The user UUID to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_uuid(uuid: string, safe?: boolean): Promise<IUser> {
    return this.find_user_by_field("uuid", uuid, safe);
  }

  /**
   * Finds a project by the specified project UUID
   * @param uuid The project UUID to search for
   * @returns The project object if found, null otherwise
   */
  public async find_project_by_uuid(uuid: string, safe?: boolean): Promise<IProject> {
    return this.find_project_by_field("uuid", uuid, safe);
  }

  /**
   * Finds a project by the specified project name
   * @param name The project name to search for
   * @returns The project object if found, null otherwise
   */
  public async find_project_by_name(uuid: string): Promise<IProject> {
    return this.find_project_by_field("name", uuid);
  }

  /**
   * Finds a comment by the specified comment uuid
   * @param uuid The comment uuid to search for
   * @returns The comment object if found, null otherwise
   */
  public async find_comment_by_uuid(uuid: string): Promise<IComment> {
    return this.find_comment_by_field("uuid", uuid);
  }

  /**
   * Finds a user by the specified username
   * @param username The username to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_username(username: string, safe?: boolean): Promise<IUser> {
    return this.find_user_by_field("username", username, safe);
  }

  /**
   * Finds a user by the specified email
   * @param email The email to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_email(email: string, safe?: boolean): Promise<IUser> {
    return this.find_user_by_field("email", email, safe);
  }
}
