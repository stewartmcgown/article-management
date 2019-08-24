import WebSocket from 'ws';
import { Auth, RequiredAuth } from './auth';
export interface Headers extends StringObject {
    'User-Agent': string;
    Host: string;
    Upgrade: string;
    Connection: string;
    Pragma: string;
    'Cache-Control': string;
    'Accept-Encoding': string;
    'Accept-Language': string;
    Origin: string;
    Cookie: string;
}
export interface CookieOptions extends Auth {
    funnelType: 'free';
    browser_info: string;
    experiment_groups?: string;
    firefox_freemium?: 'true' | 'false';
}
export interface Connection {
    connection: WebSocket;
    auth: Auth;
}
export declare function buildCookieString(pairs: CookieOptions): string;
/**
 * Pretty generic headers for connecting
 *
 * @param Cookie a string cookie, used for auth
 */
export declare function buildWebsocketHeaders(Cookie: string): Headers;
/**
 * Create the options needed for connecting to the remote Grammarly host.
 */
export declare function buildWSOptions(auth: Auth): WebSocket.ClientOptions;
/**
 * Connect to the remote WebSocket
 *
 * @param userAuth a custom user auth object
 */
export declare function connect(userAuth?: RequiredAuth): Promise<Connection>;
