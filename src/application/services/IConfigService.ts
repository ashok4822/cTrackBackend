export interface IConfigService {
  get(key: string): string;
  getNumber(key: string): number;
  getBoolean(key: string): boolean;
}
