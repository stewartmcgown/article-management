import { IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AbstractModel } from './AbstractModel';

@Entity()
export class Subject extends AbstractModel {

    @Column()
    @IsNotEmpty()
    public name: string;

}
