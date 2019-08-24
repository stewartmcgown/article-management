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
const consola_1 = __importDefault(require("consola"));
const ws_1 = __importDefault(require("ws"));
const connection_1 = require("./connection");
const messages_1 = require("./messages");
/**
 * Manage an interactive Grammarly session.
 */
class Grammarly {
    constructor(options = {}) {
        this.options = options;
    }
    get isEstablished() {
        return (this.connection !== undefined &&
            this.connection instanceof ws_1.default &&
            this.connection.readyState === ws_1.default.OPEN);
    }
    /**
     * Analyse some text
     *
     * @param text text to analyse
     * @param timeout how long to wait before we stop collecting results
     */
    analyse(text, timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isEstablished) {
                yield this.establish();
            }
            consola_1.default.debug('Successfully connected to Grammarly!');
            return new Promise((resolve, reject) => {
                // Send the text now that we have
                this.connection.send(JSON.stringify(messages_1.buildOTMessage(text)));
                consola_1.default.debug('Sent text to Grammarly!');
                const alerts = [];
                /**
                 * This message handler will listen for all corrections from the server. Once it receives
                 * the {@link CompleteMessage} object the promise will resolve.
                 */
                this.connection.onmessage = (message) => {
                    const parsed = JSON.parse(message.data.toString());
                    // Message is probably a correction
                    if (parsed.action === 'alert') {
                        const alert = parsed;
                        alerts.push(alert);
                    }
                    else if (parsed.action === 'finished') {
                        const result = parsed;
                        resolve({
                            alerts,
                            result,
                            original: text
                        });
                        this.connection.close();
                    }
                };
                // Handle timeout
                const interval = setInterval(() => {
                    reject(new Error('Still waiting for results before timeout'));
                    this.connection.close();
                    clearInterval(interval);
                }, timeout);
            });
        });
    }
    /**
     * Establish communication with the Grammarly API.
     *
     * @returns the initial response message
     * @throws {Object} if cookies are bad
     */
    establish() {
        return __awaiter(this, void 0, void 0, function* () {
            consola_1.default.debug('Re-establishing connection.');
            const { connection } = yield connection_1.connect(this.options.auth);
            this.connection = connection;
            this.connection.send(JSON.stringify(messages_1.buildInitialMessage()));
            consola_1.default.debug('Sent establishing message');
            return new Promise((resolve, reject) => {
                /**
                 * The first message should be in this form:
                 *
                 * ```js
                 * { sid: 0, action: 'start', id: 0 }
                 * ```
                 *
                 *  Receiving this, without another 'error' message, means the connection is
                 *  ready to go and we can start sending text.
                 */
                this.connection.onmessage = (message) => {
                    const parsedMessage = JSON.parse(message.data.toString());
                    if (parsedMessage && parsedMessage.action === 'start') {
                        this.connection.onmessage = () => null; // Garbage collect
                        resolve(parsedMessage);
                    }
                    else {
                        reject(parsedMessage);
                    }
                };
            });
        });
    }
}
exports.Grammarly = Grammarly;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5Qiw0Q0FBNkM7QUFFN0MsNkNBQXVDO0FBQ3ZDLHlDQUE4RTtBQXVCOUU7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFXcEIsWUFBb0IsVUFBNEIsRUFBRTtRQUE5QixZQUFPLEdBQVAsT0FBTyxDQUF1QjtJQUFHLENBQUM7SUFSdEQsSUFBWSxhQUFhO1FBQ3ZCLE9BQU8sQ0FDTCxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsWUFBWSxZQUFTO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxLQUFLLFlBQVMsQ0FBQyxJQUFJLENBQzlDLENBQUM7SUFDSixDQUFDO0lBSUQ7Ozs7O09BS0c7SUFDVSxPQUFPLENBQ2xCLElBQVksRUFDWixVQUFrQixLQUFLOztZQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdkIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDeEI7WUFFRCxpQkFBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBRXRELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3JDLGlDQUFpQztnQkFDakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsaUJBQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFFekMsTUFBTSxNQUFNLEdBQXNCLEVBQUUsQ0FBQztnQkFFckM7OzttQkFHRztnQkFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQXFCLEVBQUUsRUFBRTtvQkFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBRW5ELG1DQUFtQztvQkFDbkMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTt3QkFDN0IsTUFBTSxLQUFLLEdBQUcsTUFBeUIsQ0FBQzt3QkFFeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDcEI7eUJBQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTt3QkFDdkMsTUFBTSxNQUFNLEdBQUcsTUFBMEIsQ0FBQzt3QkFFMUMsT0FBTyxDQUFDOzRCQUNOLE1BQU07NEJBQ04sTUFBTTs0QkFDTixRQUFRLEVBQUUsSUFBSTt5QkFDZixDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDekI7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUVGLGlCQUFpQjtnQkFDakIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtvQkFDaEMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDeEIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ1csU0FBUzs7WUFDckIsaUJBQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUU3QyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxvQkFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFFN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw4QkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU1RCxpQkFBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRTNDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3JDOzs7Ozs7Ozs7bUJBU0c7Z0JBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFxQixFQUFFLEVBQUU7b0JBQ3BELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQ1QsQ0FBQztvQkFFakIsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7d0JBQ3JELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQjt3QkFDMUQsT0FBTyxDQUFDLGFBQTRCLENBQUMsQ0FBQztxQkFDdkM7eUJBQU07d0JBQ0wsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUN2QjtnQkFDSCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNGO0FBaEhELDhCQWdIQyJ9