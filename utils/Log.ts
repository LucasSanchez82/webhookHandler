import fs from "fs";

export default class Log {
  static filePath = "logs.json";
  static getJson() {
    return JSON.parse(fs.readFileSync(Log.filePath, "utf8")) ?? [];
  }
  static initializeJsonFileIfNeeded() {
    if (!fs.existsSync(Log.filePath)) {
      fs.writeFileSync(Log.filePath, "[]");
    }
  }
  static add(message: string) {
    console.log(message);
    Log.initializeJsonFileIfNeeded();
    const newEntry = { timestamp: new Date().toISOString(), message };
    const newContent = JSON.stringify([...Log.getJson(), newEntry], null, 2);
    fs.writeFileSync(Log.filePath, newContent);
  }
}
