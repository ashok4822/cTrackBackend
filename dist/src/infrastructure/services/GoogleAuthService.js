"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class GoogleAuthService {
    client;
    clientId;
    constructor(configService) {
        this.clientId = configService.get("GOOGLE_CLIENT_ID");
        const clientSecret = configService.get("GOOGLE_CLIENT_SECRET");
        this.client = new google_auth_library_1.OAuth2Client(this.clientId, clientSecret, "postmessage");
    }
    async verifyGoogleToken(code) {
        const { tokens } = await this.client.getToken(code);
        const idToken = tokens.id_token;
        if (!idToken) {
            throw new Error(ResponseMessage_1.ResponseMessage.GOOGLE_ID_TOKEN_FAILED);
        }
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: this.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
            throw new Error(ResponseMessage_1.ResponseMessage.INVALID_GOOGLE_PAYLOAD);
        }
        return {
            email: payload.email,
            name: payload.name,
            googleId: payload.sub,
            profileImage: payload.picture,
        };
    }
}
exports.GoogleAuthService = GoogleAuthService;
//# sourceMappingURL=GoogleAuthService.js.map