import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';

import { AbstractModel } from './AbstractModel';

@Entity()
@Unique(['name'])
export class Subject extends AbstractModel {

    @Column()
    @IsNotEmpty()
    public name: string;

}
