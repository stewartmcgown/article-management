import {
    registerDecorator, validateSync, ValidationArguments, ValidationOptions
} from 'class-validator';

/**
 * Calls the {@link class-validator} synchronous validate method on it.
 *
 * Only applicable to functions marked with `@validated()`
 */
export function validate(): any {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        Validator.register(target, propertyKey, parameterIndex);
    };
}

/**
 * Marks a function as a Validated one. Validated functions can have parameters
 * marked with `@validate()`.
 */
export function validated(): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        // wrapping the original method
        descriptor.value = function (...args: any[]): Promise<any> {

            Validator.performValidation(target, propertyKey, args);

            const result = originalMethod.apply(this, args);
            return result;
        };
    };
}

/**
 * Specifies that a property is an array of Class instances.
 *
 * @param validationOptions for validation
 */
export function IsNonPrimitiveArray(validationOptions?: ValidationOptions): any {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsNonPrimitiveArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): any {
                    return Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'object' && !Array.isArray(b), true);
                },
            },
        });
    };
}

/**
 * A parameter decorator validator
 */
export class Validator {

    public static register(target: any, methodName: string, paramIndex: number): void {
        let paramMap: Map<string, number[]> = this.validatorMap.get(target);
        if (!paramMap) {
            paramMap = new Map();
            this.validatorMap.set(target, paramMap);
        }
        let paramIndexes: number[] = paramMap.get(methodName);
        if (!paramIndexes) {
            paramIndexes = [];
            paramMap.set(methodName, paramIndexes);
        }
        paramIndexes.push(paramIndex);
    }

    public static performValidation(target: any, methodName: string, paramValues: any[]): boolean {
        const notNullMethodMap: Map<string, number[]> = this.validatorMap.get(target);
        if (!notNullMethodMap) {
            return true;
        }

        const paramIndexes: number[] = notNullMethodMap.get(methodName);
        if (!paramIndexes) {
            return true;
        }

        for (const [index, paramValue] of paramValues.entries()) {
            if (paramIndexes.indexOf(index) !== -1) {
                // Actual validation logic
                const validationErrors = validateSync(paramValue);

                if (validationErrors.length) {
                    throw {
                        errors: validationErrors,
                        message: 'There are errors in your POST',
                        name: 'ValidationError',
                    };
                }
            }
        }

        return true;
    }

    private static validatorMap: Map<any, Map<string, number[]>> = new Map();

}
