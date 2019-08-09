import { IsNotEmpty } from 'class-validator';
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
    public position: Positions;

    @Column({
        type: 'enum',
        enum: Levels,
        default: Levels.JUNIOR,
    })
    @IsNotEmpty()
    public level: Levels;

    @Column()
    public subjects: string;
}
