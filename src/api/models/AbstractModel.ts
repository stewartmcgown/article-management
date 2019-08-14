import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractModel {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
}
