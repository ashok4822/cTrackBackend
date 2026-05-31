import { OAuth2Client } from "google-auth-library";
import { IAuthService, GoogleUserDetails } from "../../application/services/IAuthService";
import { IConfigService } from "../../application/services/IConfigService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { ExternalMapper } from "../../application/mappers/ExternalMapper";

export class GoogleAuthService implements IAuthService {
  private readonly _client: OAuth2Client;
  private readonly _clientId: string;

  constructor(private readonly _configService: IConfigService) {
    this._clientId = this._configService.get("GOOGLE_CLIENT_ID");
    const clientSecret = this._configService.get("GOOGLE_CLIENT_SECRET");
    
    this._client = new OAuth2Client(
      this._clientId,
      clientSecret,
      "postmessage"
    );
  }

  async verifyGoogleToken(code: string): Promise<GoogleUserDetails> {
    const { tokens } = await this._client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error(ResponseMessage.GOOGLE_ID_TOKEN_FAILED);
    }

    const ticket = await this._client.verifyIdToken({
      idToken,
      audience: this._clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error(ResponseMessage.INVALID_GOOGLE_PAYLOAD);
    }
    return ExternalMapper.toGoogleUserDetails(payload as { email: string; name: string; sub: string; picture: string });
  }
}
