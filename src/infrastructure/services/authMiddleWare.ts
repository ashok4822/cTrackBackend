import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "./JwtTokenService";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { UserRole } from "../../domain/entities/User";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

const tokenService = new JwtTokenService();

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  companyName?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: ResponseMessage.NO_TOKEN });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = tokenService.verify<TokenPayload>(
      token,
      process.env.JWT_ACCESS_SECRET || "access_fallback",
    );
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      console.warn("AuthMiddleware: Token expired");
    } else {
      console.error("AuthMiddleware: Token verification failed", error);
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: ResponseMessage.INVALID_TOKEN });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: ResponseMessage.INSUFFICIENT_PERMISSIONS });
    }
    next();
  };
};
