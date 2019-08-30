import { ProtectionRules, Rule, RULES } from './Rules';

/**
 * Protected decorator for managing object updates.
 *
 * This module is primarily used to validate user input. Imagine a use case where you want to have multi-user
 * access to a single entity, but depending on the user's access level they can only change certain parts of that
 * entity.
 *
 * The best example to give is the one that this module was written for, an Article Management system.
 *
 * ```ts
 * class Article {
 *      public title: string;
 *
 *      public submissionDate: Date;
 *
 *      public status: string;
 * }
 * ```
 *
 * We want our Junior level editors to be able to update the Article with a new status, but we only want senior level
 * editors to have access to modifying more sensitive properties like the title. This module allows us to annotate
 * each property with the information we need to keep isolation of responsibility between users.
 *
 * ```ts
 * class Article {
 *      @Protected({
 *          roles: [Levels.ADMIN, Levels.SENIOR]
 *      })
 *      public title: string;
 *
 *      @Protected({
 *          immutable: true
 *      })
 *      public submissionDate: Date;
 *
 *      public status: string;
 * }
 * ```
 *
 * @author Stewart McGown <stewart@mcgown.dev>
 */

const PROTECTED_METADATA_KEY = 'PROTECTED_METADATA_KEY';

export interface AttemptUpdateOptions {
    fail?: boolean;

    data?: any;
}

/**
 * Means a protected property could not be updated
 */
export interface ProtectedFailure {
    /**
     * The target object
     */
    target: object;

    /**
     * The property on which an update was attempted
     */
    property: string;

    /**
     * The value that was attempted to be assigned to the property
     */
    attemptedUpdate: any;

    /**
     * The rule that failed
     */
    rule: string;
}

export function getMetadataKey(property: string): string {
    return PROTECTED_METADATA_KEY + ':' + property;
}

/**
 * A property annotated with `Protected` provides protection from modification
 * by unauthorised users.
 *
 * ```ts
 * class Entity {
 *  public name: string;
 *
 *  @Protected({
 *      immutable: true
 *  })
 *  public email: string;
 * }
 * ```
 *
 * @param options protection options
 */
export function Protected(options: ProtectionRules): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        const propertyName = propertyKey ? propertyKey.toString() : '';

        Reflect.defineMetadata(getMetadataKey(propertyName), options, target);
    };
}

/**
 * Attempt to update an object.
 *
 * ```ts
 * const entity = new Entity();
 * entity.name = 'Stewart';
 * entity.email = 'stewart@mcgown.dev';
 *
 * attemptUpdate(entity, {
 *  name: 'David',
 *  email: 'david@example.com'
 * });
 *
 * entity.name // 'David'
 * entity.email // 'stewart@mcgown.dev'
 * ```
 *
 * @param target the object to update
 * @param update the new properties to update the object with
 * @param options to specify behaviour
 *
 * @returns an array of errors
 * @throws an array of errors if options.fail is set to true.
 */
export function attemptUpdate(target: object, update: object, options: AttemptUpdateOptions = {}): ProtectedFailure[] {
    const errors = [];

    const fail = (err: ProtectedFailure): void => {
        errors.push(err);
    };

    Object.entries(update).forEach(updateEntries => {
        const [propertyKey, updateValue] = updateEntries;
        const meta: ProtectionRules = Reflect.getMetadata(getMetadataKey(propertyKey), target);

        if (propertyKey in target && meta) {
            Object.entries(meta).forEach(metaEntries => {
                const [ruleKey, ruleArg] = metaEntries;

                const rule = getRule(ruleKey);

                if (!rule.test(updateValue, target[propertyKey], ruleArg, options.data)) {
                    return fail({
                        target,
                        property: propertyKey,
                        attemptedUpdate: updateValue,
                        rule: rule.name,
                    });
                }
            });

            if (!errors.length) {
                Object.defineProperty(target, propertyKey, { value: updateValue });
            }
        }
    });

    if (options.fail) { throw errors; }

    return errors;
}

export function getRule(rule: string): Rule {
    return RULES.find(r => r.name === rule);
}
