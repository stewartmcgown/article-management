import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { Column, Entity } from 'typeorm';

import { User } from './User';

@Entity()
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
    @IsNotEmpty()
    @Field()
    public country: string;

    @Column()
    @Field()
    public teacher: string;

    @Column()
    @Field()
    public profile: string;
}
