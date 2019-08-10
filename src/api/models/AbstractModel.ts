import { PrimaryColumn } from 'typeorm';

export abstract class AbstractModel {
    @PrimaryColumn('uuid')
    public id: string;
}
