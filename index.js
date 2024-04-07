import {
  cancel,
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
  let actionType;
  let commitBody;
  let ticketId;
  let operationResponse;
  let terminalCommand;

  console.log();

  intro(color.green("888                                    "));
  console.log(
    color.gray("│ "),
    color.green("888                                    ")
  );
  console.log(
    color.gray("│ "),
    color.green("888                                    ")
  );
  console.log(
    color.gray("│ "),
    color.green("888  .d88b.   .d88b.   .d88b.  888d888 ")
  );
  console.log(
    color.gray("│ "),
    color.green('888 d88""88b d88P"88b d8P  Y8b 888P"   ')
  );
  console.log(
    color.gray("│ "),
    color.green("888 888  888 888  888 88888888 888     ")
  );
  console.log(
    color.gray("│ "),
    color.green("888 Y88..88P Y88b 888 Y8b.     888     ")
  );
  console.log(
    color.gray("│ "),
    color.green('888  "Y88P"   "Y88888  "Y8888  888     ')
  );
  console.log(
    color.gray("│ "),
    color.green("                  888                  ")
  );
  console.log(
    color.gray("│ "),
    color.green("             Y8b d88P                  ")
  );
  console.log(
    color.gray("│ "),
    color.green('              "Y88P"                   ')
  );

  const operationType = await select({
    message: "¿Qué operación deberíamos realizar?:",
    options: [
      { value: "commit", label: "Nuevo commit" },
      { value: "branch", label: "Nueva rama" },
      { value: "version", label: "Nueva versión" },
    ],
  });

  if (isCancel(operationType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  if (operationType === "version") {
    notSuppBro(process);

    const versionType = await select({
      message: "¿Qué versión deberíamos subir?:",
      options: [
        {
          value: "prerelease",
          label: "Prerelease",
          hint: "v1.2.3-rc.4 -> v1.2.3-rc.5",
        },
        { value: "stable", label: "Stable", hint: "v1.2.3-rc.4 -> v1.2.3" },
        {
          value: "prepatch",
          label: "Pre patch",
          hint: "v1.2.3-rc.4 -> v1.2.4-rc.0",
        },
        {
          value: "preminor",
          label: "Pre minor",
          hint: "v1.2.3-rc.4 -> v1.3.0-rc.0",
        },
        {
          value: "premajor",
          label: "Pre major",
          hint: "v1.2.3-rc.4 -> v2.0.0-rc.0",
        },
        {
          value: "manual",
          label: "Manual",
          hint: "Please avoid this :(",
        },
      ],
    });

    if (isCancel(versionType)) {
      cancel("Operation cancelled");
      return process.exit(0);
    }

    switch (versionType) {
      case "prerelease":
        // const operationResponse = execSync(`npm version prerelease --preid=rc -m "v%s"`, {
        //   encoding: "utf-8",
        // });
        operationResponse = execSync(`ls`, {
          encoding: "utf-8",
        });
        break;
      case "stable":
        operationResponse = execSync(`ls`, {
          encoding: "utf-8",
        });
        break;
      case "prepatch":
        notSuppBro(process);
        break;
      case "preminor":
        notSuppBro(process);
        break;
      case "premajor":
        notSuppBro(process);
        break;

      case "manual":
        break;
      default:
        return process.exit(0);
    }
  }

  if (operationType === "branch" || operationType === "commit") {
    /* ID del ticket */
    ticketId = await text({
      message: "Inserte ID del ticket padre?",
    });

    if (isCancel(ticketId)) {
      cancel("Operation cancelled");
      return process.exit(0);
    }

    /* Tipo de acción */
    actionType = await select({
      message: "Tipo de acción:",
      options: [
        { value: "feat", label: "Feature" },
        { value: "fix", label: "Fix" },
        { value: "style", label: "Style" },
        { value: "build", label: "Build" },
        { value: "hotfix", label: "Hotfix" },
        { value: "refactor", label: "Refactor" },
        { value: "docs", label: "Documentation" },
        { value: "manual", label: "Manual" },
      ],
    });

    if (isCancel(actionType)) {
      cancel("Operation cancelled");
      return process.exit(0);
    }

    if (operationType === "commit") {
      commitBody = await text({
        message: "Inserte descripción del commit:",
        initialValue: "",
        validate(value) {
          if (!value || value.trim().length === 0)
            return "La descripción es requerida!";
        },
      });

      if (isCancel(commitBody)) {
        cancel("Operation cancelled");
        return process.exit(0);
      }

      const commitMessage = `${actionType}${
        ticketId ? "[#" + ticketId.trim() + "]" : ""
      }: ${commitBody.trim()}`;

      terminalCommand = `git add . && git commit -m "${commitMessage}"`;
    }

    if (operationType === "branch") {
      commitBody = await text({
        message: "Inserte descripción de la rama:",
        initialValue: "",
        validate(value) {
          if (!value || value.trim().length === 0)
            return "La descripción es requerida!";
        },
      });

      if (isCancel(commitBody)) {
        cancel("Operation cancelled");
        return process.exit(0);
      }

      const branchName = `${actionType}${commitBody.trim()}/${
        ticketId ? "/#" + ticketId.trim() : ""
      }`;

      terminalCommand = `git checkout -b ${branchName}`;
    }
  }

  const s = spinner();
  s.start("Installing via npm");

  // commitMessage = `${actionType}${
  //   ticketId ? "[#" + ticketId.trim() + "]" : ""
  // }: ${commitBody.trim()}`;

  console.log("command: ", terminalCommand);

  // const res = execSync(`git add . && git commit -m "${commitMessage}"`, {
  //   encoding: "utf-8",
  // });

  // console.log("Respuesta: ", operationResponse);

  await sleep(1000);

  s.stop("Listo!");

  outro("Gracias :)");
}

main().catch(console.error);

function notSuppBro(process) {
  console.log(color.gray("│"));
  console.log(color.red("x  Error!  ───────────────────────╮"));
  console.log(color.red("│                                 │"));
  console.log(color.red("│   Todavía no está soportado :(  │"));
  console.log(color.red("│                                 │"));
  console.log(color.red("├─────────────────────────────────╯"));
  outro("Lo 100to :'(");
  return process.exit(0);
}
