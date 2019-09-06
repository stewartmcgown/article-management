import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { Article } from './Article';
import { Team } from './Team';
import { User } from './User';

@Entity()
@ObjectType()
export class Editor extends User {

    @ManyToMany(type => Team, team => team.editors)
    @JoinTable()
    @Field(() => [Team])
    public teams: Team[];

    @Column()
    @Field()
    public subjects: string;

    @ManyToMany(type => Article, article => article.editors)
    @Field(() => [Article])
    public articles: Article[];
}
