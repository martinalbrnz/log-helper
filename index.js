import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { execSync } from "child_process";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";

async function main() {
  console.log();
  intro(color.bgGreen(`log-helper`));
  console.log(
    color.gray("│ "),
    color.bgGreen(color.black(color.bold("mono mono mono")))
  );

  const name = await text({
    message: "Inserte ID del ticket padre?",
    placeholder: "86dmoejds",
  });

  if (isCancel(name)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const shouldContinue = await confirm({
    message: "Do you want to continue?",
  });

  if (isCancel(shouldContinue)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const commitType = await select({
    message: "Pick a project type.",
    options: [
      { value: "ts", label: "TypeScript" },
      { value: "js", label: "JavaScript" },
      { value: "coffee", label: "CoffeeScript", hint: "oh no" },
    ],
  });

  if (isCancel(commitType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const projectType = await select({
    message: "Pick a project type.",
    options: [
      { value: "ts", label: "TypeScript" },
      { value: "js", label: "JavaScript" },
      { value: "coffee", label: "CoffeeScript", hint: "oh no" },
    ],
  });

  if (isCancel(projectType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const s = spinner();
  s.start("Installing via npm");

  const res = execSync("ls", { encoding: "utf-8" });
  console.log("res: ", res);

  await sleep(3000);

  s.stop("Installed via npm");

  console.log();

  outro("You're all set!");

  await sleep(1000);
}

main().catch(console.error);
