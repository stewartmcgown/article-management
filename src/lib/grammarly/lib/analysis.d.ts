import { GrammarlyResult } from './api';
import { ProblemResponse } from './responses';
export interface TransformResult {
    /**
     * The transformed text
     */
    text: string;
    /**
     * How different is the length of this string to the previous?
     *
     * Positive numbers indicate a greater length, negative a shorter length.
     */
    diff: number;
}
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
export declare function applyTransform(text: string, alert: ProblemResponse): TransformResult;
/**
 * Updates an alert's properties by the specified diff amounts
 *
 * @param alert the alert to update
 * @param diff how much to adjust by
 */
export declare function updateAlert(alert: ProblemResponse, diff: number): ProblemResponse;
/**
 * Corrects a Grammarly result and returns the updated object
 */
export declare function correct(result: GrammarlyResult): GrammarlyResult;
