import { CookieOptions } from './connection';
export interface BrowserStringOptions {
    browser?: 'firefox' | 'chrome';
    system: 'mac' | 'windows';
}
/**
 * Canonical Auth object that contains all the authenitcation tokens needed
 * to access Grammarly.
 */
export interface Auth {
    gnar_containerId: string;
    grauth?: string;
    'csrf-token'?: string;
    redirect_location: string;
}
/**
 * Parsed values from the 'set-cookies' headers
 */
export interface RequiredAuth {
    grauth: string;
    'csrf-token': string;
}
export interface AuthHostOrigin {
    Host: string;
    Origin: string;
}
/**
 * Generates a containerId for use in the cookie request. Must be the same as the
 * one sent to generate grauth.
 */
export declare function generateContainerId(): string;
/**
 * Generate a random browser string
 *
 * TODO: Get list of supported browser strings
 */
export declare function generateBrowserString(options?: BrowserStringOptions): string;
/**
 * Authentication with Grammarly requires a number of Cookie parameters to
 * be correctly set, namely the ones in {@link CookieOptions}. You can get most
 * of these through a request to the free endpoint:
 *
 * ```js
 * fetch('https://auth.grammarly.com/v3/user/oranonymous?app=firefoxExt&containerId=mrrq95v5ogec702')
 * ```
 */
export declare function getAuthCookies(auth: Auth): CookieOptions;
export declare function generateAuthURL(user?: string, app?: string, containerId?: string): string;
/**
 * Redirect locations aren't tied to a session. They are base64 encoded objects.
 *
 * Example:
 * ```json
 * {
 *  "type": "",
 *  "location":"https://www.grammarly.com/after_install_page?extension_install=true&utm_medium=store&utm_source=firefox"
 * }
 * ```
 *
 */
export declare function generateRedirectLocation(browser?: string): string;
export declare function buildAuthHeaders(Cookie: string, containerId: string, Origin?: string, Host?: string): any;
/**
 * Get the values of the auth response cookies
 *
 * TODO: May have to allow for expiry time extraction later
 *
 * @param cookies array of cookies to parse
 */
export declare function parseResponseCookies(cookies: string[]): RequiredAuth;
/**
 * Requests auth information from Grammarly
 *
 * @returns auth object that contains information about this session. Auth
 * objects are used in both initial Cookie transfer and are occasionally sent
 * over the websocket connection.
 */
export declare function buildAuth(origin?: string, host?: string, authUrl?: string): Promise<Auth>;
export declare function buildAuthWithUserTokens(userTokens: RequiredAuth): Auth;
