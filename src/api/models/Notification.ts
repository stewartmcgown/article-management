import { IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AbstractModel } from './AbstractModel';

@Entity()
export class Notification extends AbstractModel {

    @Column()
    @IsNotEmpty()
    public title: string;

    @Column()
    @IsNotEmpty()
    public message: string;

}
