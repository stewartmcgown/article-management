import { IsNotEmpty } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn
} from 'typeorm';

import { Author } from './Author';
import { Editor } from './Editor';

export enum Status {
        'In Review' = 'In Review',
        'Failed Data Check' = 'Failed Data Check',
        'Passed Data Check' = 'Passed Data Check',
        'Technical Review' = 'Technical Review',
        'Revisions Requested' = 'Revisions Requested',
        'Ready to Publish' = 'Ready to Publish',
        'Published' = 'Published',
        'Submitted' = 'Submitted',
        'Rejected' = 'Rejected',
        'Final Review' = 'Final Review',
}

export enum Type {
    'Review Article' = 'Review Article',
    'Blog' = 'Blog',
    'Original Research' = 'Original Research',
    'Magazine Article' = 'Magazine Article',
}

export enum Subject {
    'Biology' = 'Biology',
    'Chemistry' = 'Chemistry',
    'Computer Science' = 'Computer Science',
    'Engineering' = 'Engineering',
    'Environmental & Earth Science' = 'Environmental & Earth Science',
    'Materials Science' = 'Materials Science',
    'Mathematics' = 'Mathematics',
    'Medicine' = 'Medicine',
    'Physics' = 'Physics',
    'Policy & Ethics' = 'Policy & Ethics',
}

/**
 * Represents an Article
 */
@Entity()
export class Article  {

    @PrimaryColumn('uuid')
    public id: string;

    @CreateDateColumn()
    public date: Date;

    @IsNotEmpty()
    @Column()
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

    @ManyToMany(type => Editor)
    @JoinTable()
    public editors: Editor[];

    @ManyToMany(type => Author)
    @JoinTable()
    public authors: Author[];
}
