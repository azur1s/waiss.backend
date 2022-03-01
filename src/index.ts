require("dotenv").config();
import { Backend } from "./Backend";
async function main() {
  const backend = await Backend.create();
}

main();
