import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Subject } from './Article';

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
export class Editor {
    @PrimaryColumn('uuid')
    public id: string;

    @Column()
    @IsNotEmpty()
    public name: string;

    @Column()
    @IsNotEmpty()
    public email: string;

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

    @Column()
    @IsNotEmpty()
    public subjects: Subject[];
}
