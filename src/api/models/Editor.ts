import { Entity, PrimaryColumn } from 'typeorm';

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

    public name: string;

    public email: string;

    public position: Positions;

    public level: Levels;

    public totalEdited: number;

    public currentlyEditing: number;

    public subjects: Subject[];
}
