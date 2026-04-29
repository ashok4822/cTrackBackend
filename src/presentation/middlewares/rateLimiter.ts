import { rateLimit } from "express-rate-limit";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";


export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: ResponseMessage.TOO_MANY_REQUESTS,
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 50, // Limit each IP to 50 requests per `window` for auth routes
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: ResponseMessage.TOO_MANY_LOGIN_ATTEMPTS,
  },
});
