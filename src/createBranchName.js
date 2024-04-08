import { execSync } from "child_process";
import color from "picocolors";

export async function createBranch({
  actionType,
  operationDescription,
  ticketId,
}) {
  const kebabDescription = operationDescription
    .toLowerCase()
    .replace(new RegExp(/[^0-9a-zA-Z\s-]+/g), "")
    .trim()
    .replace(new RegExp(/\s+/g), "-");

  if (actionType === "manual") {
    execSync(`git checkout -b ${kebabDescription}`, {
      encoding: "utf-8",
      windowsHide: true,
    });
  } else {
    const branchName = `${actionType}/${kebabDescription}${
      ticketId ? "/#" + ticketId : ""
    }`;

    console.log(color.gray("│ "));
    execSync(`git checkout -b ${branchName}`, {
      encoding: "utf-8",
      windowsHide: true,
    });
  }
}
