import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { Article } from './Article';
import { Levels } from './enums';
import { User } from './User';

@Entity()
@ObjectType()
export class Author extends User {

    @Column()
    @IsNotEmpty()
    @Field()
    public school: string;

    @Column()
    @IsNotEmpty()
    @Field()
    public biography: string;

    @Column()
    @IsDefined()
    @IsString()
    @Field()
    public country: string;

    @Column({
        nullable: true,
    })
    @Field()
    public teacher: string;

    @Column({
        nullable: true,
    })
    @Field()
    public profile: string;

    @ManyToMany(type => Article, article => article.authors)
    @Field(() => [Article])
    public articles: Article[];

    constructor() {
        super();
        this.level = Levels.AUTHOR;
    }
}
