import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

import { AbstractModel } from './AbstractModel';

export abstract class User extends AbstractModel {

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    public email: string;

    @Column({ nullable: true })
    public lastPinIssued: Date;

    @Column({ nullable: true, select: false })
    public secret: string;

    @Column({ nullable: true, select: false })
    public token: string;

}