import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { Column, PrimaryColumn } from 'typeorm';

export abstract class User  {

    @PrimaryColumn('uuid')
    @Field()
    public id: string;

    @IsNotEmpty()
    @Column()
    @Field()
    public name: string;

    @IsNotEmpty()
    @Column()
    @Field()
    public email: string;

}
