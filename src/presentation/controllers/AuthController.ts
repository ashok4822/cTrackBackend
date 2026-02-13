import { Request, Response } from "express";
import { Login } from "../../application/useCases/Login";
import { CustomerSignup } from "../../application/useCases/CustomerSignup";
import { RefreshToken } from "../../application/useCases/RefreshToken";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class AuthController {
  constructor(
    private loginUseCase: Login,
    private customerSignUpUseCase: CustomerSignup,
    private refrershTokenUseCase: RefreshToken,
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      });

      return res
        .status(HttpStatus.OK)
        .json({ accesToken: result.accessToken, user: result.user });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      await this.customerSignUpUseCase.execute(email, password, name);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Customer created successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Refresh token missing" });
      }

      const result = await this.refrershTokenUseCase.execute(refreshToken);
      return res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }
}
