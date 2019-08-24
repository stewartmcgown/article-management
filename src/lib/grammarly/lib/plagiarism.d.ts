import { AuthHostOrigin } from './auth';
export interface PartialProblemResponse {
    category?: string;
    group?: string;
    categoryHuman?: string;
    count?: number;
}
export interface PlagiarismResult extends PartialProblemResponse {
    text: string;
    hasPlagiarism: boolean;
}
export declare function getPlagiarismHostOrigin(): AuthHostOrigin;
/**
 * Free Plagiarism Checker
 *
 *
 * @author Stewart McGown
 */
export declare function plagiarism(text: string): Promise<PlagiarismResult>;
