import { Backend } from "./Backend";
import dotenv from "dotenv";
import { Logger } from "./util/logger";
dotenv.config();
Logger.info("test", "abc");
Logger.warn("omg!!", "warning: error :(");
Logger.error("skill");

async function main() {
  const backend = await Backend.create();
}

main();
