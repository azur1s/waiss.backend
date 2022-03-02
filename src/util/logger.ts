const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";

const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

export class Logger {
  /**
   * Get current time in format of "HH:mm:ss AM/PM" with colors.
   * @returns {string} The formatted time.
   */
  static time(): string {
    let time = new Date().toLocaleTimeString();
    return `${DIM}${time}${RESET}`;
  }

  /**
   * Log a message with level of normal information.
   * Should be used on normal log messages and etc.
   * @example Logger.info("Got connection from", connection.ip);
   * @param args the arguments to be logged.
   * @author azur1s
   */
  static info = (...args: any[]): void => {
    console.log(`${this.time()} ${GREEN}[Info]${RESET}`, ...args);
  };

  /**
   * Log a message with level of warning.
   * Should be used on warnings (e.g. no config file found).
   * @example Logger.warn("No config file found, using default config");
   * @param args the arguments to be logged.
   * @author azur1s
   */
  static warn = (...args: any[]): void => {
    console.log(`${this.time()} ${YELLOW}[Warn]${RESET}`, ...args);
  };

  /**
   * Log a message with level of error.
   * Should be used on important errors (e.g. database connection failed).
   * @example Logger.error("Database connection failed", error);
   * @param args the arguments to be logged.
   * @author azur1s
   */
  static error = (...args: any[]): void => {
    console.log(`${this.time()} ${RED}[Error]${RESET}`, ...args);
  };
}
