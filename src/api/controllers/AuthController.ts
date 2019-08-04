import { Body, JsonController, Post } from 'routing-controllers';

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
    public token(@Body() request: TokenRequest): Promise<TokenResponse> {
        return this.authService.issueToken(request.pin, request.email);
    }

}
