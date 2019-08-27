import { IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { Article } from './Article';
import { Positions } from './enums/Positions';
import { User } from './User';

@Entity()
@ObjectType()
export class Editor extends User {

    @Column({
        type: 'enum',
        enum: Positions,
        default: Positions.EDITOR,
    })
    @IsNotEmpty()
    @Field(() => Positions)
    public position: Positions;

    @Column()
    @Field()
    public subjects: string;

    @ManyToMany(type => Article, article => article.editors)
    @Field(() => [Article])
    public articles: Article[];
}
