import { OAuth2Client } from "google-auth-library";
import { IAuthService, GoogleUserDetails } from "../../application/services/IAuthService";
import { IConfigService } from "../../application/services/IConfigService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class GoogleAuthService implements IAuthService {
  private client: OAuth2Client;
  private clientId: string;

  constructor(configService: IConfigService) {
    this.clientId = configService.get("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get("GOOGLE_CLIENT_SECRET");
    
    this.client = new OAuth2Client(
      this.clientId,
      clientSecret,
      "postmessage"
    );
  }

  async verifyGoogleToken(code: string): Promise<GoogleUserDetails> {
    const { tokens } = await this.client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error(ResponseMessage.GOOGLE_ID_TOKEN_FAILED);
    }

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error(ResponseMessage.INVALID_GOOGLE_PAYLOAD);
    }

    return {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      profileImage: payload.picture,
    };
  }
}
