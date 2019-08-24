import { RequiredAuth } from './auth';
import { FinishedResponse, ProblemResponse } from './responses';
/**
 * The completed result from a Grammarly analysis session
 */
export interface GrammarlyResult {
    alerts: ProblemResponse[];
    result: FinishedResponse;
    corrected?: string;
    original: string;
}
export interface GrammarlyOptions {
    username?: string;
    password?: string;
    auth?: RequiredAuth;
}
/**
 * Manage an interactive Grammarly session.
 */
export declare class Grammarly {
    private options;
    private connection;
    private readonly isEstablished;
    constructor(options?: GrammarlyOptions);
    /**
     * Analyse some text
     *
     * @param text text to analyse
     * @param timeout how long to wait before we stop collecting results
     */
    analyse(text: string, timeout?: number): Promise<GrammarlyResult>;
    /**
     * Establish communication with the Grammarly API.
     *
     * @returns the initial response message
     * @throws {Object} if cookies are bad
     */
    private establish;
}
