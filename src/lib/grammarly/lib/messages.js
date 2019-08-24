"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("uuid"));
/**
 * Convert a string to a basic initial insert
 *
 * @param str the string to insert
 * @param pos the existing position of the insert.
 */
exports.stringToTransform = (str, pos) => {
    return `+0:${pos || '0'}:${str}:0`;
};
exports.buildInitialMessage = () => ({
    type: 'initial',
    docid: uuid.v4(),
    client: 'extension_chrome',
    protocolVersion: '1.0',
    clientSupports: [
        'free_clarity_alerts',
        'readability_check',
        'filler_words_check',
        'sentence_variety_check',
        'free_occasional_premium_alerts'
    ],
    dialect: 'british',
    clientVersion: '14.924.2437',
    extDomain: 'keep.google.com',
    action: 'start',
    id: 0,
    sid: 0
});
exports.buildOTMessage = (str) => ({
    ch: [exports.stringToTransform(str)],
    rev: 0,
    id: 0,
    action: 'submit_ot'
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQTBHN0I7Ozs7O0dBS0c7QUFDVSxRQUFBLGlCQUFpQixHQUFHLENBQUMsR0FBVyxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQzdELE9BQU8sTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVXLFFBQUEsbUJBQW1CLEdBQUcsR0FBZ0IsRUFBRSxDQUFDLENBQUM7SUFDckQsSUFBSSxFQUFFLFNBQVM7SUFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtJQUNoQixNQUFNLEVBQUUsa0JBQWtCO0lBQzFCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLGNBQWMsRUFBRTtRQUNkLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIsb0JBQW9CO1FBQ3BCLHdCQUF3QjtRQUN4QixnQ0FBZ0M7S0FDakM7SUFDRCxPQUFPLEVBQUUsU0FBUztJQUNsQixhQUFhLEVBQUUsYUFBYTtJQUM1QixTQUFTLEVBQUUsaUJBQWlCO0lBQzVCLE1BQU0sRUFBRSxPQUFPO0lBQ2YsRUFBRSxFQUFFLENBQUM7SUFDTCxHQUFHLEVBQUUsQ0FBQztDQUNQLENBQUMsQ0FBQztBQUVVLFFBQUEsY0FBYyxHQUFHLENBQUMsR0FBVyxFQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELEVBQUUsRUFBRSxDQUFDLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLEdBQUcsRUFBRSxDQUFDO0lBQ04sRUFBRSxFQUFFLENBQUM7SUFDTCxNQUFNLEVBQUUsV0FBVztDQUNwQixDQUFDLENBQUMifQ==