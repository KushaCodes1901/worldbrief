import { spawn } from "node:child_process";
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], { stdio: "inherit", env: { ...process.env, WORLDBRIEF_DEMO_MODE: "true" } });
child.on("exit", (code) => process.exit(code ?? 1));
