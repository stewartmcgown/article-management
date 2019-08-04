import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { Column, Entity } from 'typeorm';

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
        default: Positions.EDITOR,
    })
    @IsNotEmpty()
    @Field()
    public position: Positions;

    @Column({
        type: 'enum',
        enum: Levels,
        default: Levels.JUNIOR,
    })
    @IsNotEmpty()
    @Field()
    public level: Levels;

    @Column({
        array: true,
    })
    @Field(type => [String])
    public subjects: string;
}
