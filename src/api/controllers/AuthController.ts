import { Response } from 'express';
import { Body, JsonController, Post, Res } from 'routing-controllers';

import { AuthService } from '../../auth/AuthService';
import { PinRequest } from './requests/PinRequest';
import { TokenRequest } from './requests/TokenRequest';
import { PinResponse } from './responses/PinResponse';
import { TokenResponse } from './responses/TokenResponse';

@JsonController('/auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('/pin')
    public pin(@Body() request: PinRequest): Promise<PinResponse> {
        return this.authService.issuePin(request.email);
    }

    @Post('/token')
    public async token(@Body() request: TokenRequest, @Res() response: Response): Promise<TokenResponse> {
        const tokenResponse = await this.authService.issueToken(request.pin, request.email);

        response.cookie(AuthService.COOKIE_TOKEN_KEY, tokenResponse.token, {
            expires: new Date(Date.now() + AuthService.EXPIRES_IN.ms),
            httpOnly: true,
        });

        return tokenResponse;
    }

}
