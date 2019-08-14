import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Unique } from 'typeorm';

import { AbstractModel } from './AbstractModel';
import { Levels } from './enums/Levels';

@Unique(['email'])
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

    @Exclude()
    @Column({ nullable: true, select: false })
    public secret: string;

    @Column({
        type: 'enum',
        enum: Levels,
        default: Levels.AUTHOR,
    })
    @IsNotEmpty()
    public level: Levels;
}
