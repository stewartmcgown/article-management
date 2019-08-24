"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * When applying a transform, the origin text gets offset by a certain amount. This means that the
 * responses that are to be applied next will be out of date, therefore they must be updated
 * every run.
 *
 * One application of the transform should
 *  - Replace the specified characters in the text
 *  - Get the total length diff
 *  - Update all other responses
 *  - return a new result object
 */
function applyTransform(text, alert) {
    const replacement = alert.replacements[0];
    const substringToTransform = text.substring(alert.begin, alert.end);
    const transformed = replacement
        ? text.substring(0, alert.begin) + replacement + text.substring(alert.end)
        : text;
    const diff = replacement
        ? replacement.length - substringToTransform.length
        : 0;
    return {
        text: transformed,
        diff
    };
}
exports.applyTransform = applyTransform;
/**
 * Updates an alert's properties by the specified diff amounts
 *
 * @param alert the alert to update
 * @param diff how much to adjust by
 */
function updateAlert(alert, diff) {
    const { begin, end, highlightBegin, highlightEnd, transformJson } = alert;
    const { e, s } = transformJson.context;
    return Object.assign({}, alert, { begin: begin + diff, end: end + diff, highlightBegin: highlightBegin + diff, highlightEnd: highlightEnd + diff, transformJson: Object.assign({}, transformJson, { context: {
                e: e + diff,
                s: s + diff
            } }) });
}
exports.updateAlert = updateAlert;
/**
 * Corrects a Grammarly result and returns the updated object
 */
function correct(result) {
    const { alerts } = result;
    return alerts.reduce((prev, currentAlert) => {
        const { text, diff } = applyTransform(prev.corrected || prev.original, currentAlert);
        // Apply diff to every appropriate part of the following alerts
        prev.alerts.forEach((tbd, i) => {
            prev.alerts[i] = updateAlert(tbd, diff);
        });
        return Object.assign({}, prev, { corrected: text });
    }, result);
}
exports.correct = correct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHlzaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2FuYWx5c2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBaUJBOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixjQUFjLENBQzVCLElBQVksRUFDWixLQUFzQjtJQUV0QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVwRSxNQUFNLFdBQVcsR0FBRyxXQUFXO1FBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUMxRSxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRVQsTUFBTSxJQUFJLEdBQUcsV0FBVztRQUN0QixDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxNQUFNO1FBQ2xELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFTixPQUFPO1FBQ0wsSUFBSSxFQUFFLFdBQVc7UUFDakIsSUFBSTtLQUNMLENBQUM7QUFDSixDQUFDO0FBcEJELHdDQW9CQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsV0FBVyxDQUN6QixLQUFzQixFQUN0QixJQUFZO0lBRVosTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFMUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBRXZDLHlCQUNLLEtBQUssSUFDUixLQUFLLEVBQUUsS0FBSyxHQUFHLElBQUksRUFDbkIsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQ2YsY0FBYyxFQUFFLGNBQWMsR0FBRyxJQUFJLEVBQ3JDLFlBQVksRUFBRSxZQUFZLEdBQUcsSUFBSSxFQUNqQyxhQUFhLG9CQUNSLGFBQWEsSUFDaEIsT0FBTyxFQUFFO2dCQUNQLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSTtnQkFDWCxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUk7YUFDWixPQUVIO0FBQ0osQ0FBQztBQXRCRCxrQ0FzQkM7QUFFRDs7R0FFRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxNQUF1QjtJQUM3QyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRTFCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRTtRQUMxQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FDbkMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUMvQixZQUFZLENBQ2IsQ0FBQztRQUVGLCtEQUErRDtRQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFFSCx5QkFDSyxJQUFJLElBQ1AsU0FBUyxFQUFFLElBQUksSUFDZjtJQUNKLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNiLENBQUM7QUFuQkQsMEJBbUJDIn0=