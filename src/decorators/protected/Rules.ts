import { Levels } from '../../api/models/enums';

/**
 * List of available rules. Do make sure to actually put these
 */
export interface ProtectionRules {
    roles?: any[];
    immutable?: boolean;
    fn?: () => boolean;
}

export interface Rule {
    name: string;

    description?: string;

    /**
     * Function to test for this rule.
     *
     * @param update value to update property with
     * @param old current property value
     * @param ruleArg argument passed to the rule
     * @param data extra data supplied when called with `attemptUpdate`
     */
    test(update: any, old: any, ruleArg: any, data?: any): boolean;
}

export const RULES: Rule[] = [
    {
        name: 'roles',
        test: (update, old, allowedRoles: any[] = [], userRole: any) => allowedRoles.includes(userRole),
    },
    {
        name: 'immutable',
        test: () => false,
    },
];

export function addRules(...rules: Rule[]): void {
    RULES.concat(rules);
}
