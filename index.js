import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";

async function main() {
  console.log();
  intro(color.bgGreen(`log-helper`));
  console.log(
    color.gray("│ "),
    color.bgGreen(color.black(color.bold("mono mono mono")))
  );

  const operationType = await select({
    message: "¿Qué operación deberíamos realizar?:",
    options: [
      { value: "commit", label: "Nuevo commit" },
      { value: "branch", label: "Nueva rama" },
      { value: "version", label: "Nueva versión" },
      { value: "cancel", label: "Cancelar" },
    ],
  });

  if (isCancel(operationType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  if (operationType === "version") {
    const versionType = await select({
      message: "¿Qué versión deberíamos subir?:",
      options: [
        {
          value: "prerelease",
          label: "Prerelease",
          hint: "v1.2.3-rc.4 -> v1.2.3-rc.5",
        },
        { value: "prerelease", label: "Stable", hint: "v1.2.3-rc.4 -> v1.2.3" },
        {
          value: "prerelease",
          label: "Pre patch",
          hint: "v1.2.3-rc. -> v1.2.4-rc.0",
        },
        {
          value: "prerelease",
          label: "Pre minor",
          hint: "v1.2.3-rc.4 -> v1.3.0-rc.0",
        },
        {
          value: "prerelease",
          label: "Pre major",
          hint: "v1.2.3-rc.4 -> v2.0.0-rc.0",
        },
      ],
    });

    if (isCancel(versionType)) {
      cancel("Operation cancelled");
      return process.exit(0);
    }
  }

  const ticketId = await text({
    message: "Inserte ID del ticket padre?",
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
    initialValue: "",
    validate(value) {
      console.log("value: ", value);
      if (!value || value.trim().length === 0)
        return "La descripción es requerida!";
    },
  });

  if (isCancel(commitBody)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const s = spinner();
  s.start("Installing via npm");

  const commitMessage = `${commitType}${
    ticketId ? "[#" + ticketId.trim() + "]" : ""
  }: ${commitBody.trim()}`;

  // const res = execSync(`git add . && git commit -m "${commitMessage}"`, {
  //   encoding: "utf-8",
  // });

  await sleep(3000);

  s.stop(commitMessage);

  outro(commitMessage);

  await sleep(1000);
}

main().catch(console.error);