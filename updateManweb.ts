import { exec } from "child_process";
import { promisify } from "util";
import Log from "./utils/Log";

const execAsync = promisify(exec);

export default async function updateManweb(): Promise<boolean> {
  const path = process.env.manwebPath;
  if (!path) throw new Error("no manwebPath provided in Environment variables");

  Log.add(`Updating Next.js application at ${path}`);

  try {
    Log.add("Resetting local changes...");
    await execAsync("git reset --hard HEAD", { cwd: path });

    Log.add("Pulling latest changes from git...");
    await execAsync("git pull", { cwd: path });

    Log.add("Installing dependencies...");
    await execAsync("bun install", { cwd: path });

    Log.add("Building application...");
    await execAsync("bun run build", { cwd: path });

    Log.add("Restarting application...");
    await execAsync(`pm2 restart ${path}/ecosystem.config.cjs`, { cwd: path });

    Log.add("Update completed successfully");
    return true;
  } catch (error) {
    Log.add("Error updating Next.js application: \n" + error);
    throw error;
  }
}
