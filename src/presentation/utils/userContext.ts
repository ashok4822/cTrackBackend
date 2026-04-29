import { Request } from "express";
import { UserContextDto } from "../../application/dto/CommonDto";

export const extractUserContext = (req: Request): UserContextDto => {
  return {
    userId: req.user?.id || 'unknown',
    userName: req.user?.name || req.user?.email || 'unknown',
    userRole: req.user?.role || 'unknown',
    ipAddress: req.ip || req.socket.remoteAddress || 'unknown'
  };
};
