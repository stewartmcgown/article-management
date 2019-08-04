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

    @Column({ nullable: true, select: false })
    public secret: string;

    @Column({ nullable: true, select: false })
    public token: string;

}
