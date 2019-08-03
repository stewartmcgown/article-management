import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';

import { PinRequest } from './requests/PinRequest';
import { TokenRequest } from './requests/TokenRequest';
import { PinResponse } from './responses/PinResponse';
import { TokenResponse } from './responses/TokenResponse';

@Authorized()
@JsonController('/auth')
export class AuthController {

    @Post('/pin')
    public pin(@Body() request: PinRequest): Promise<PinResponse> {
        return undefined;
    }

    @Post('/token')
    public token(@Body() request: TokenRequest): Promise<TokenResponse> {
        return undefined;
    }

}
