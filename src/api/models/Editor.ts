import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { AfterLoad, Column, Entity } from 'typeorm';

import { Subject } from './Article';
import { User } from './User';

export enum Positions {
    EDITOR = 'Editor',
    PRODUCTION = 'Production',
}

export enum Levels {
    JUNIOR = 'Junior',
    SENIOR = 'Senior',
    ADMIN = 'Admin',
}

@Entity()
export class Editor extends User {

    @Column()
    @IsNotEmpty()
    @Field()
    public position: Positions;

    @Column()
    @IsNotEmpty()
    @Field()
    public level: Levels;

    @Column({
        type: 'enum',
    })
    @IsNotEmpty()
    @Field()
    public subjects: Subject[];
}
