export interface IUser {
  avatar: string; // The avatar url of the user
  uuid: string; // The uuid of the user
  username: string; // The username of the user
  email: string; // The email of the user
  password: string; // The user's hashed password
  created_at: number; // The time the user was created
  updated_at: number; // The modification date of the user
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
  committees: string; // A list of UUIDs of the users who committed this version
  summary: string; // Notes about the version
  path: string; // The path of where the project files are located in the cdn
  comments: Comment; // A list of comments
  render_preview_url?: string; // The render preview url
}

export interface IComment {
  uuid: string; // A unique specifier for the comment so we can tell comments apart
  content: string; // The content of the comment
  created_at: number; // Epoch date of the when this comment was created
  updated_at: number; // Epoch date of the when this comment was last updated
}

/**
 * Database handler class
 * @class DatabaseManager
 */
export class DatabaseManager {
  constructor(public database_url: string, public app_name: string, public database_name: string) {}

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
   * Finds a user by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The user object if found, null otherwise
   */
  private async find_user_by_field(field_name: string, field_value: string): Promise<IUser> {
    return null;
  }

  /**
   * Finds a project by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The project object if found, null otherwise
   */
  private async find_project_by_field(field_name: string, field_value: string): Promise<IProject> {
    return null;
  }

  /**
   * Finds a comment by the specified field name and value
   * @param field_name The field name to search by
   * @param field_value The value to search for
   * @returns The comment object if found, null otherwise
   */
  public async find_comment_by_field(field_name: string, field_value: string): Promise<IComment> {
    return null;
  }

  /**
   * Finds a user by the specified user UUID
   * @param uuid The user UUID to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_uuid(uuid: string): Promise<IUser> {
    return null;
  }

  /**
   * Finds a project by the specified project UUID
   * @param uuid The project UUID to search for
   * @returns The project object if found, null otherwise
   */
  public async find_project_by_uuid(uuid: string): Promise<IProject> {
    return null;
  }

  /**
   * Finds a project by the specified project name
   * @param name The project name to search for
   * @returns The project object if found, null otherwise
   */
  public async find_project_by_name(uuid: string): Promise<IProject> {
    return null;
  }

  /**
   * Finds a comment by the specified comment uuid
   * @param uuid The comment uuid to search for
   * @returns The comment object if found, null otherwise
   */
  public async find_comment_by_uuid(uuid: string): Promise<IComment> {
    return null;
  }

  /**
   * Finds a user by the specified username
   * @param username The username to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_username(username: string): Promise<IUser> {
    return null;
  }

  /**
   * Finds a user by the specified email
   * @param email The email to search for
   * @returns The user object if found, null otherwise
   */
  public async find_user_by_email(email: string): Promise<IUser> {
    return null;
  }
}
