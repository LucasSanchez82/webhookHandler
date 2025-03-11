import { execSync } from "child_process";
import Log from "./utils/Log";

export default function updateManweb() {
  const path = process.env.manwebPath;
  if (!path) throw new Error("no manwebPath provided in Environment variables");

  Log.add(`Updating Next.js application at ${path}`);

  try {
    Log.add("Pulling latest changes from git...");
    execSync("git pull", { cwd: path, stdio: "inherit" });

    Log.add("Installing dependencies...");
    execSync("bun install", { cwd: path, stdio: "inherit" });

    Log.add("Building application...");
    execSync("bun run build", { cwd: path, stdio: "inherit" });

    Log.add("Restarting application...");
    execSync(`pm2 restart ${path}/ecosystem.config.cjs`, {
      cwd: path,
      stdio: "inherit",
    });

    Log.add("Update completed successfully");
    return true;
  } catch (error) {
    Log.add("Error updating Next.js application: \n" + error);
    throw error;
  }
}

updateManweb();
