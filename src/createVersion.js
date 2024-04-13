import { execSync } from "child_process";
import color from "picocolors";

export async function createVersion({ versionType, manualVersion }) {
  if (versionType === "manual") {
    console.log(color.gray("│ "));
    execSync(`npm version "${manualVersion}" -m "v%s"`, {
      encoding: "utf-8",
      windowsHide: true,
    });
  } else {
    // TODO: Set custom preid according to environment value
    // TODO: Set custom commit message according to environment value
    console.log(color.gray("│ "));
    execSync(`npm version ${versionType} --preid=rc -m "v%s"`);
  }
}
