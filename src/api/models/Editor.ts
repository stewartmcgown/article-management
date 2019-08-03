import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { Column, Entity } from 'typeorm';

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

    @Column({
        type: 'enum',
        enum: Positions,
    })
    @IsNotEmpty()
    @Field()
    public position: Positions;

    @Column({
        type: 'enum',
        enum: Levels,
    })
    @IsNotEmpty()
    @Field()
    public level: Levels;

    @Column({
        type: 'enum',
        enum: Subject,
    })
    @IsNotEmpty()
    @Field(type => [Subject])
    public subjects: Subject[];
}
