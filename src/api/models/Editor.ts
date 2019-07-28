import { IsNotEmpty } from 'class-validator';
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

    @Column()
    @IsNotEmpty()
    public position: Positions;

    @Column()
    @IsNotEmpty()
    public level: Levels;

    @Column()
    @IsNotEmpty()
    public totalEdited: number;

    @Column()
    @IsNotEmpty()
    public currentlyEditing: number;

    @Column({
        type: 'enum',
    })
    @IsNotEmpty()
    public subjects: Subject[];
}
