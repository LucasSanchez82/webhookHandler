import fs from "fs";

export default class Log {
  static filePath = "log.json";
  static getJson() {
    return JSON.parse(fs.readFileSync(Log.filePath, "utf8")) ?? [];
  }
  static add(message: string) {
    const newEntry = { timestamp: new Date().toISOString(), message };
    const newContent = JSON.stringify([...Log.getJson(), newEntry], null, 2);
    fs.writeFileSync(Log.filePath, newContent);
  }
}
