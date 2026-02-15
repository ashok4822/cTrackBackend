import { Request, Response } from "express";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class UserController {
  constructor(private adminCreateUserUseCase: AdminCreateUser) {}

  async createUser(req: Request, res: Response) {
    try {
      const { email, password, role, name } = req.body;
      await this.adminCreateUserUseCase.execute(email, password, role, name);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: `${role} created successfully` });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
