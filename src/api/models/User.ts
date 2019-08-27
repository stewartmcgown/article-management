import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'routing-controllers/node_modules/class-transformer';
import { Field } from 'type-graphql';
import { Column, Unique } from 'typeorm';

import { AbstractModel } from './AbstractModel';
import { Levels } from './enums/Levels';

@Unique(['email'])
export abstract class User extends AbstractModel {

    @IsNotEmpty()
    @Column()
    @Field()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    @Field()
    public email: string;

    @Column({ nullable: true })
    @Field(type => Date)
    public lastPinIssued: Date;

    @Exclude()
    @Column({ nullable: true, select: false })
    @Field()
    public secret: string;

    @Column({
        type: 'enum',
        enum: Levels,
        default: Levels.AUTHOR,
    })
    @IsNotEmpty()
    @Field(type => Levels)
    public level: Levels;
}
