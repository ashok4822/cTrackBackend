import bcrypt from "bcrypt";
import { IHashService } from "../../application/services/IHashService";

export class BcryptHashService implements IHashService {
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
