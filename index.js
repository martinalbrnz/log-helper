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
import { createBranch } from "./src/createBranchName.js";
import { createCommit } from "./src/createCommitMessage.js";
import { createVersion } from "./src/createVersion.js";
import { initialLog } from "./src/initialLog.js";

async function main() {
  let actionType;
  let operationDescription;
  let ticketId;
  let terminalCommand;
  let manualVersion;
  const s = spinner();

  console.log();

  initialLog();
  intro("Bienvenido!");

  const operationType = await select({
    message: "¿Qué operación deberíamos realizar?:",
    options: [
      { value: "commit", label: "Nuevo commit" },
      { value: "branch", label: "Nueva rama" },
      { value: "version", label: "Nueva versión" },
    ],
  });

  if (isCancel(operationType)) {
    cancel("Operación cancelada");
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
      cancel("Operación cancelada");
      return process.exit(0);
    }

    manualVersion = await text({
      message: "Inserte versión manual:",
      validate(value) {
        if (!value || value.trim().length === 0)
          return "La descripción es requerida!";
      },
    });

    if (isCancel(manualVersion)) {
      cancel("Operación cancelada");
      return process.exit(0);
    }

    s.start("Creando nueva versión");

    createVersion(versionType, manualVersion);
  }

  if (operationType === "branch" || operationType === "commit") {
    /* Tipo de acción */
    actionType = await select({
      message: "Tipo de acción:",
      options: [
        { value: "feat", label: "Feature" },
        { value: "fix", label: "Fix" },
        { value: "style", label: "Style" },
        { value: "build", label: "Build" },
        { value: "hotfix", label: "Hotfix" },
        { value: "manual", label: "Manual" },
      ],
    });

    if (isCancel(actionType)) {
      cancel("Operación cancelada");
      return process.exit(0);
    }

    if (actionType !== "manual") {
      /* ID del ticket */
      ticketId = await text({
        message: "Inserte ID del ticket padre?",
      });

      if (isCancel(ticketId)) {
        cancel("Operación cancelada");
        return process.exit(0);
      }
    }

    if (operationType === "commit") {
      operationDescription = await text({
        message: "Inserte descripción del commit:",
        validate(value) {
          if (!value || value.trim().length === 0)
            return "La descripción es requerida!";
        },
      });

      if (isCancel(operationDescription)) {
        cancel("Operación cancelada");
        return process.exit(0);
      }

      const shouldAddChanges = await confirm({
        message: "¿Agregar todos los cambios?",
        active: "Si",
        inactive: "No",
      });

      if (isCancel(shouldAddChanges)) {
        cancel("Operación cancelada");
        return process.exit(0);
      }

      if (shouldAddChanges) {
        execSync(`git add .`, {
          encoding: "utf-8",
          windowsHide: true,
        });
      }

      s.start("Creando commit");

      createCommit({
        actionType,
        operationDescription,
        ticketId,
      });
    }

    if (operationType === "branch") {
      operationDescription = await text({
        message: "Inserte descripción de la rama:",
        validate(value) {
          if (!value || value.trim().length === 0)
            return "La descripción es requerida!";
        },
      });

      if (isCancel(operationDescription)) {
        cancel("Operación cancelada");
        return process.exit(0);
      }

      s.start("Creando rama");

      createBranch({ actionType, operationDescription, ticketId });
    }
  }

  await sleep(1000);

  s.stop("Listo!");

  const shouldPushChanges = await confirm({
    message: "¿Subir cambios a origen?",
    active: "Si",
    inactive: "No",
  });

  if (isCancel(shouldPushChanges)) {
    cancel("Operación cancelada");
    return process.exit(0);
  }

  if (shouldPushChanges) {
    s.start("Subiendo cambios...");
    execSync(`git push origin`, {
      encoding: "utf-8",
      windowsHide: true,
    });
    s.stop("Listo!");
  }

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
