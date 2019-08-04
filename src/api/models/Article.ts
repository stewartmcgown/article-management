import { IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import {
    Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn
} from 'typeorm';

import { Author } from './Author';
import { Editor } from './Editor';

export enum Status {
        'In Review',
        'Failed Data Check',
        'Passed Data Check',
        'Technical Review',
        'Revisions Requested',
        'Ready to Publish',
        'Published',
        'Submitted',
        'Rejected',
        'Final Review',
}

export enum Type {
    'Review Article',
    'Blog',
    'Original Research',
    'Magazine Article',
}

export enum Subject {
    'Biology',
    'Chemistry',
    'Computer Science',
    'Engineering',
    'Environmental & Earth Science',
    'Materials Science',
    'Mathematics',
    'Medicine',
    'Physics',
    'Policy & Ethics',
}

/**
 * Represents an Article
 */
@Entity()
export class Article  {

    @PrimaryColumn('uuid')
    @Field()
    public id: string;

    @CreateDateColumn()
    @Column()
    @Field()
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
    @Field()
    public type: Type;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.Submitted,
    })
    @Field()
    public status: Status;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Subject,
    })

    @IsNotEmpty()
    @Column()
    @Field()
    public docId: string;

    @Column()
    @Field()
    public deadline: Date;

    @Column()
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

    @Column()
    @Field()
    public copyright: string;

    @Column({
        default: false,
    })
    @Field()
    public trashed: boolean;

    @IsNotEmpty()
    @Column()
    @Field()
    public summary: string;

    @Column()
    @Field()
    public reason: string;

    @UpdateDateColumn()
    @Column()
    @Field()
    public modified: Date;

    @ManyToMany(type => Editor)
    @JoinTable()
    @Field(type => [Editor])
    public editors: Editor[];

    @ManyToMany(type => Author)
    @JoinTable()
    @Field(type => [Author])
    public authors: Author[];
}
