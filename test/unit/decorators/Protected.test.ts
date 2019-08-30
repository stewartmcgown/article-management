import { Levels } from '../../../src/api/models/enums';
import { attemptUpdate, Protected } from '../../../src/decorators/protected';

describe('protected annotation', () => {

    class Entity {
        public name: string;

        @Protected({
            immutable: true
        })
        public email: string;

        @Protected({
            roles: ['myRole'],
        })
        public time: string;
    }

    const email = 'email@email.org';
    const name = 'Name';

    let entity: Entity;

    beforeEach(() => {
        entity = new Entity();
        entity.email = email;
        entity.name = 'Name';
    });

    describe('immutable rule', () => {

        it('should protect immutable properties from writes', () => {
            expect(() => attemptUpdate(entity, { email: 'changed' }, { fail: true })).toThrow();

            expect(entity.email).toEqual(email);
        });

        it('should allow unprotected properties to be assigned', () => {
            const entity = new Entity();
            entity.email = email;
            entity.name = 'Name';

            attemptUpdate(entity, { name: 'changed' });

            expect(entity.name).toEqual(name);
        });
    });

    describe('roles rule', () => {
        it('should prevent non-admins from changing this property', () => {
            expect(() => attemptUpdate(entity, { time: 'new time' }, { fail: true })).toThrow();
        });
    });

});
