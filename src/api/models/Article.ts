import { IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
    AfterLoad, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, UpdateDateColumn
} from 'typeorm';

import { AbstractModel } from './AbstractModel';
import { Author } from './Author';
import { Editor } from './Editor';
import { Status } from './enums/Status';
import { Subject } from './enums/Subject';
import { Type } from './enums/Type';

/**
 * Represents an Article
 */
@Entity()
@ObjectType()
export class Article extends AbstractModel {

    @CreateDateColumn()
    @Field(type => Date)
    public date: Date;

    @IsNotEmpty()
    @Column()
    @Field()
    public title: string;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Type,
        default: Type['Review Article'],
    })
    @Field(() => Type)
    public type: Type;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.Submitted,
    })
    @Field(() => Status)
    public status: Status;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Subject,
    })
    @Field(() => Subject)
    public subject: Subject;

    @IsNotEmpty()
    @Column()
    @Field()
    public docId: string;

    @Column({
        nullable: true,
    })
    @Field(() => Date)
    public deadline: Date;

    @Column({
        nullable: true,
    })
    @Field()
    public notes: string;

    @IsNotEmpty()
    @Column()
    @Field()
    public folderId: string;

    @IsNotEmpty()
    @Column()
    @Field()
    public markingGridId: string;

    @Column({
        nullable: true,
    })
    @Field()
    public copyright: string;

    @Column({
        default: false,
    })
    @Field()
    public trashed: boolean;

    @IsNotEmpty()
    @Column({
        nullable: true,
    })
    @Field()
    public summary: string;

    @Column({
        nullable: true,
    })
    @Field()
    public reason: string;

    @UpdateDateColumn()
    @Field(type => Date)
    public modified: Date;

    @Column({
        nullable: true,
        name: 'wordpress_id',
    })
    @Field()
    public wordpressId: number;

    @ManyToMany(type => Editor, editor => editor.articles, {
        cascade: true,
    })
    @JoinTable()
    @Field(type => [Editor])
    public editors: Editor[];

    @ManyToMany(type => Author, author => author.articles, {
        cascade: true,
    })
    @JoinTable()
    @Field(type => [Author])
    public authors: Author[];

    @Field()
    public link: string;

    @AfterLoad()
    public getLink(): void {
        this.link = `https://drive.google.com/open?id=${this.docId}`;
    }
}
