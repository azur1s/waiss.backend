import { Backend } from "./Backend";
import dotenv from "dotenv";
import { Logger } from "./util/logger";
dotenv.config();

async function main() {
  const backend = await Backend.create();
}

main();
