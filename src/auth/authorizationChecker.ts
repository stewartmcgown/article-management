import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { AuthService } from './AuthService';

export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        const token = authService.parseTokenFromRequest(action.request);

        if (token === undefined) {
            return false;
        }

        action.request.user = await authService.verifyToken(token);

        if (action.request.user === undefined) {
            return false;
        }

        console.log(roles);

        return true;
    };
}
