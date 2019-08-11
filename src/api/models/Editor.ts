import { IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { User } from './User';

export enum Positions {
    EDITOR = 'Editor',
    PRODUCTION = 'Production',
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

    @Column()
    public subjects: string;
}
