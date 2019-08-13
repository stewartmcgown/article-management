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
    public type: Type;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.Submitted,
    })
    public status: Status;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Subject,
    })
    public subject: Subject;

    @IsNotEmpty()
    @Column()
    public docId: string;

    @Column({
        nullable: true,
    })
    public deadline: Date;

    @Column({
        nullable: true,
    })
    public notes: string;

    @IsNotEmpty()
    @Column()
    public folderId: string;

    @IsNotEmpty()
    @Column()
    public markingGridId: string;

    @Column({
        nullable: true,
    })
    public copyright: string;

    @Column({
        default: false,
    })
    public trashed: boolean;

    @IsNotEmpty()
    @Column({
        nullable: true,
    })
    public summary: string;

    @Column({
        nullable: true,
    })
    public reason: string;

    @UpdateDateColumn()
    public modified: Date;

    @Column({
        nullable: true,
        name: 'wordpress_id',
    })
    public wordpressId: number;

    @ManyToMany(type => Editor, editor => editor.articles, {
        cascade: true,
    })
    @JoinTable()
    public editors: Editor[];

    @ManyToMany(type => Author, author => author.articles, {
        cascade: true,
    })
    @JoinTable()
    public authors: Author[];

    public link: string;

    @AfterLoad()
    public getLink(): void {
        this.link = `https://drive.google.com/open?id=${this.docId}`;
    }
}
