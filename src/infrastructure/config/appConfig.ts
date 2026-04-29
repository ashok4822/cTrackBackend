import { IConfigService } from "../../application/services/IConfigService";
import dotenv from "dotenv";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

dotenv.config();

export class AppConfig implements IConfigService {
  get(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`${ResponseMessage.CONFIG_KEY_MISSING}: ${key}`);
    }
    return value;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`${ResponseMessage.CONFIG_KEY_NOT_NUMBER}: ${key}`);
    }
    return num;
  }

  getBoolean(key: string): boolean {
    const value = this.get(key).toLowerCase();
    return value === "true" || value === "1";
  }
}

export const appConfig = new AppConfig();
