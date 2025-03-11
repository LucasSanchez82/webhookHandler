import Log from "./utils/Log";
import { spawn } from "child_process";

export default async function updateManweb(): Promise<boolean> {
  const path = process.env.manwebPath;
  if (!path) throw new Error("no manwebPath provided in Environment variables");

  Log.add(`Updating Next.js application at ${path}`);

  const execCommand = (command: string, args: string[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, {
        cwd: path,
        stdio: "inherit",
      });

      childProcess.on("error", (err) => {
        reject(err);
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Command ${command} ${args.join(" ")} failed with code ${code}`
            )
          );
        }
      });
    });
  };

  try {
    Log.add("Resetting local changes...");
    await execCommand("git", ["reset", "--hard", "HEAD"]);

    Log.add("Pulling latest changes from git...");
    await execCommand("git", ["pull"]);

    Log.add("Installing dependencies...");
    await execCommand("bun", ["install"]);

    Log.add("Building application...");
    await execCommand("bun", ["run", "build"]);

    Log.add("Restarting application...");
    await execCommand("pm2", ["restart", `${path}/ecosystem.config.cjs`]);

    Log.add("Update completed successfully");
    return true;
  } catch (error) {
    Log.add("Error updating Next.js application: \n" + error);
    return false;
  }
}
