"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const connection_1 = require("./connection");
const env_1 = __importDefault(require("./env"));
const utils_1 = require("./utils");
//
// Functions
//
/**
 * Generates a containerId for use in the cookie request. Must be the same as the
 * one sent to generate grauth.
 */
function generateContainerId() {
    const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    /**
     * Alphanumeric random string implementation
     *
     * @see Grammarly-bg.js:11260
     * @author Grammarly Inc.
     */
    const alphanumeric = function e(t = 0, n = '') {
        if (t <= 0) {
            return n;
        }
        const o = Math.floor(Math.random() * (r.length - 1));
        return e(t - 1, n + r.charAt(o));
    };
    return alphanumeric(15);
}
exports.generateContainerId = generateContainerId;
/**
 * Generate a random browser string
 *
 * TODO: Get list of supported browser strings
 */
function generateBrowserString(options) {
    return 'FIREFOX:67:COMPUTER:SUPPORTED:FREEMIUM:MAC_OS_X:MAC_OS_X' || options;
}
exports.generateBrowserString = generateBrowserString;
/**
 * Authentication with Grammarly requires a number of Cookie parameters to
 * be correctly set, namely the ones in {@link CookieOptions}. You can get most
 * of these through a request to the free endpoint:
 *
 * ```js
 * fetch('https://auth.grammarly.com/v3/user/oranonymous?app=firefoxExt&containerId=mrrq95v5ogec702')
 * ```
 */
function getAuthCookies(auth) {
    return Object.assign({}, auth, { firefox_freemium: 'true', funnelType: 'free', browser_info: generateBrowserString() });
}
exports.getAuthCookies = getAuthCookies;
function generateAuthURL(user = 'oranonymous', app = 'firefoxExt', containerId = generateContainerId()) {
    return `https://auth.grammarly.com/v3/user/${user}?app=${app}&containerId=${containerId}`;
}
exports.generateAuthURL = generateAuthURL;
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
function generateRedirectLocation(browser = 'firefox') {
    return Buffer.from(JSON.stringify({
        type: '',
        location: `https://www.grammarly.com/after_install_page?extension_install=true&utm_medium=store&utm_source=${browser}`
    })).toString('base64');
}
exports.generateRedirectLocation = generateRedirectLocation;
function buildAuthHeaders(Cookie, containerId, Origin = env_1.default.origin.firefox, Host = 'auth.grammarly.com') {
    return {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Cookie,
        Host,
        Origin,
        Pragma: 'no-cache',
        'X-Container-Id': containerId,
        'X-Client-Version': '8.852.2307',
        'X-Client-Type': 'extension-firefox',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
    };
}
exports.buildAuthHeaders = buildAuthHeaders;
/**
 * Get the values of the auth response cookies
 *
 * TODO: May have to allow for expiry time extraction later
 *
 * @param cookies array of cookies to parse
 */
function parseResponseCookies(cookies) {
    const { grauth } = utils_1.cookieToObject(cookies.find(c => c.includes('grauth=')));
    const token = utils_1.cookieToObject(cookies.find(c => c.includes('csrf-token=')))['csrf-token'];
    return {
        grauth,
        'csrf-token': token
    };
}
exports.parseResponseCookies = parseResponseCookies;
/**
 * Requests auth information from Grammarly
 *
 * @returns auth object that contains information about this session. Auth
 * objects are used in both initial Cookie transfer and are occasionally sent
 * over the websocket connection.
 */
function buildAuth(origin, host, authUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const gnar_containerId = generateContainerId();
        const redirect_location = generateRedirectLocation();
        const response = yield node_fetch_1.default(authUrl || generateAuthURL(), {
            headers: buildAuthHeaders(connection_1.buildCookieString(Object.assign({}, getAuthCookies({
                gnar_containerId,
                redirect_location
            }))), gnar_containerId, origin, host)
        });
        if (!response.ok) {
            throw new Error('Unable to create a session with these credentials.');
        }
        const cookies = parseResponseCookies(response.headers.raw()['set-cookie']);
        return {
            gnar_containerId,
            grauth: cookies.grauth,
            'csrf-token': cookies['csrf-token'],
            redirect_location
        };
    });
}
exports.buildAuth = buildAuth;
function buildAuthWithUserTokens(userTokens) {
    return Object.assign({}, userTokens, { gnar_containerId: generateContainerId(), redirect_location: generateRedirectLocation() });
}
exports.buildAuthWithUserTokens = buildAuthWithUserTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNERBQStCO0FBQy9CLDZDQUFnRTtBQUNoRSxnREFBd0I7QUFDeEIsbUNBQXlDO0FBb0N6QyxFQUFFO0FBQ0YsWUFBWTtBQUNaLEVBQUU7QUFFRjs7O0dBR0c7QUFDSCxTQUFnQixtQkFBbUI7SUFDakMsTUFBTSxDQUFDLEdBQUcsZ0VBQWdFLENBQUM7SUFFM0U7Ozs7O09BS0c7SUFDSCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0lBRUYsT0FBTyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQWxCRCxrREFrQkM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQUMsT0FBOEI7SUFDbEUsT0FBTywwREFBMEQsSUFBSSxPQUFPLENBQUM7QUFDL0UsQ0FBQztBQUZELHNEQUVDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixjQUFjLENBQUMsSUFBVTtJQUN2Qyx5QkFDSyxJQUFJLElBQ1AsZ0JBQWdCLEVBQUUsTUFBTSxFQUN4QixVQUFVLEVBQUUsTUFBTSxFQUNsQixZQUFZLEVBQUUscUJB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