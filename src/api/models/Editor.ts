import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';

import { Article } from './Article';
import { Positions } from './enums/Positions';
import { User } from './User';

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

    @ManyToMany(type => Article, article => article.editors)
    public articles: Article[];
}
