import { execSync } from "child_process";
import color from "picocolors";

export async function createCommit({
  actionType,
  operationDescription,
  ticketId,
}) {
  if (actionType === "manual") {
    execSync(`git commit -m "${operationDescription}"`, {
      encoding: "utf-8",
      windowsHide: true,
    });
  } else {
    const commitDescription = `${actionType}${
      ticketId ? "[#" + ticketId + "]" : ""
    }: ${operationDescription}`;

    execSync(`git commit -m "${commitDescription}"`, {
      encoding: "utf-8",
      windowsHide: true,
    });
    console.log(color.gray("│ "), commitDescription);
  }
}
