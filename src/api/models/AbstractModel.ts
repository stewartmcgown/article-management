import { PrimaryGeneratedColumn } from 'typeorm';

/**
 * Base model to inherit from
 */
export abstract class AbstractModel {

    /**
     * A database primary key
     */
    @PrimaryGeneratedColumn('uuid')
    public id: string;
}
