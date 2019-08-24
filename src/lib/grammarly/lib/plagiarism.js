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
const auth_1 = require("./auth");
const connection_1 = require("./connection");
function getPlagiarismHostOrigin() {
    return {
        Host: 'capi.grammarly.com',
        Origin: 'https://www.grammarly.com'
    };
}
exports.getPlagiarismHostOrigin = getPlagiarismHostOrigin;
/**
 * Free Plagiarism Checker
 *
 *
 * @author Stewart McGown
 */
function plagiarism(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Host, Origin } = getPlagiarismHostOrigin();
        const auth = yield auth_1.buildAuth(Origin, 'www.grammarly.com', 'https://www.grammarly.com/plagiarism-checker');
        const results = yield node_fetch_1.default('https://capi.grammarly.com/api/check', {
            method: 'POST',
            headers: auth_1.buildAuthHeaders(connection_1.buildCookieString(auth_1.getAuthCookies(auth)), auth.gnar_containerId, Origin, Host),
            body: text
        }).then(r => r.json());
        const detected = results.find(r => r.category === 'Plagiarism' || r.group === 'Plagiarism') || {
            count: 0
        };
        // Extract plagiarism
        return Object.assign({}, detected, { text, hasPlagiarism: !!detected.count });
    });
}
exports.plagiarism = plagiarism;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhZ2lhcmlzbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcGxhZ2lhcmlzbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNERBQStCO0FBQy9CLGlDQUtnQjtBQUNoQiw2Q0FBaUQ7QUFjakQsU0FBZ0IsdUJBQXVCO0lBQ3JDLE9BQU87UUFDTCxJQUFJLEVBQUUsb0JBQW9CO1FBQzFCLE1BQU0sRUFBRSwyQkFBMkI7S0FDcEMsQ0FBQztBQUNKLENBQUM7QUFMRCwwREFLQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBc0IsVUFBVSxDQUFDLElBQVk7O1FBQzNDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsdUJBQXVCLEVBQUUsQ0FBQztRQUVuRCxNQUFNLElBQUksR0FBRyxNQUFNLGdCQUFTLENBQzFCLE1BQU0sRUFDTixtQkFBbUIsRUFDbkIsOENBQThDLENBQy9DLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBNkIsTUFBTSxvQkFBSyxDQUNuRCxzQ0FBc0MsRUFDdEM7WUFDRSxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSx1QkFBZ0IsQ0FDdkIsOEJBQWlCLENBQUMscUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLE1BQU0sRUFDTixJQUFJLENBQ0w7WUFDRCxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQ0YsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUV0QixNQUFNLFFBQVEsR0FBMkIsT0FBTyxDQUFDLElBQUksQ0FDbkQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFlBQVksQ0FDN0QsSUFBSTtZQUNILEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQztRQUVGLHFCQUFxQjtRQUNyQix5QkFDSyxRQUFRLElBQ1gsSUFBSSxFQUNKLGFBQWEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssSUFDL0I7SUFDSixDQUFDO0NBQUE7QUFuQ0QsZ0NBbUNDIn0=