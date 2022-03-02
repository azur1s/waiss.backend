const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";

const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

export class Logger {
  static time() {
    let time = new Date().toLocaleTimeString();
    return `${DIM}${time}${RESET}`;
  }

  static info = (...args: any[]) => {
    console.log(`${this.time()} ${GREEN}[Info]${RESET}`, ...args);
  };

  static warn = (...args: any[]) => {
    console.log(`${this.time()} ${YELLOW}[Warn]${RESET}`, ...args);
  };

  static error = (...args: any[]) => {
    console.log(`${this.time()} ${RED}[Error]${RESET}`, ...args);
  };
}
