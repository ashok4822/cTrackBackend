import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "./JwtTokenService";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { UserRole } from "../../domain/entities/User";

const tokenService = new JwtTokenService();

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
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
      .json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = tokenService.verify<TokenPayload>(
      token,
      process.env.JWT_ACCESS_SECRET || "access_fallback",
    );
    req.user = payload;
    next();
  } catch (error) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: "Invalid or expired token" });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};
