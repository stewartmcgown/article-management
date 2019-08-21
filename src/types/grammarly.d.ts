declare module 'grammarly-api' {
    class Grammarly {
        constructor(options?: GrammarlyOptions);

        /**
         * Analyse some text
         *
         * @param text text to analyse
         * @param timeout how long to wait before we stop collecting results
         */
        public analyse(text: string, timeout?: number): Promise<GrammarlyResult>;
    }

    export function correct(result: GrammarlyResult): GrammarlyResult;

    export function plagiarism(text: string): Promise<PlagiarismResult>;

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

    export interface Transform {
        s: number;
        e: number;
    }
    export interface TransformJson {
        context: Transform;
        highlights: Transform[];
        alternatives: any[];
    }
    export interface CardLayout {
        category: string;
        group: string;
        groupDescription: string;
        rank: number;
        outcome: string;
        outcomeDescription: string;
        outcomeRank: number;
    }
    /**
     * Base problem response. Reponses may have other properties
     * as indicated in the optional parameters.
     *
     * TODO: Expand interfaces to include all types of response
     */
    export interface ProblemResponse {
        category: string;
        pid: number;
        rid: number;
        sid: number;
        begin: number;
        end: number;
        text: string;
        group: string;
        pname: string;
        rev: number;
        highlightBegin: number;
        highlightEnd: number;
        highlightText: string;
        replacements: any[];
        transformJson: TransformJson;
        impact: string;
        extra_properties: StringObject;
        cardLayout: CardLayout;
        categoryHuman: string;
        cost: number;
        action: string;
        id: number;
        point?: string;
        transforms?: string;
        title?: string;
        details?: string;
        explanation?: string;
        examples?: string;
        todo?: string;
        handbookLink?: string;
        sentence_no?: string;
        free?: string;
        phash?: string;
        pversion?: string;
    }
    /**
     * Sent by the server when checking of the text has been completed.
     */
    export interface FinishedResponse {
        sid: number;
        rev: number;
        checkedBegin: number;
        checkedEnd: number;
        score: number;
        generalScore: number;
        removed: any[];
        errors: number;
        interrupts: number;
        skipped: number;
        rejected: number;
        blocked: number;
        dialect: string;
        foreign: boolean;
        action: 'finished';
    }

    /**
     * The completed result from a Grammarly analysis session
     */
    export interface GrammarlyResult {
        alerts: ProblemResponse[];
        result: FinishedResponse;
        corrected?: string;
        original: string;
    }

    export interface RequiredAuth {
        grauth: string;
        'csrf-token': string;
    }

    export interface GrammarlyOptions {
        username?: string;
        password?: string;
        auth?: RequiredAuth;
    }
}
