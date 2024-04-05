import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { match } from "assert";
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

  const ticketId = await text({
    message: "Inserte ID del ticket padre?",
    placeholder: "86dmoejds",
  });

  if (isCancel(ticketId)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const commitType = await select({
    message: "Tipo de commit:",
    options: [
      { value: "feat", label: "Feature" },
      { value: "fix", label: "Fix" },
      { value: "style", label: "Style" },
      { value: "build", label: "Build" },
      { value: "hotfix", label: "Hotfix" },
      { value: "refactor", label: "Refactor" },
      { value: "docs", label: "Documentation" },
    ],
  });

  if (isCancel(commitType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const commitBody = await text({
    message: "Inserte descripción del commit:",
    placeholder: "Nueva funcionalidad",
    validate: (val) => match(val, new RegExp("/^.{3,}$/")),
  });

  if (isCancel(commitBody)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  // const projectType = await select({
  //   message: "Pick a project type.",
  //   options: [
  //     { value: "ts", label: "TypeScript" },
  //     { value: "js", label: "JavaScript" },
  //     { value: "coffee", label: "CoffeeScript", hint: "oh no" },
  //   ],
  // });

  // if (isCancel(projectType)) {
  //   cancel("Operation cancelled");
  //   return process.exit(0);
  // }

  const s = spinner();
  s.start("Installing via npm");

  const res = execSync("ls", { encoding: "utf-8" });
  console.log("res: ", res);

  await sleep(3000);

  s.stop("Installed via npm");

  console.log(`${commitType}[#${ticketId}]: ${commitBody}`);

  outro("You're all set!");

  await sleep(1000);
}

main().catch(console.error);
