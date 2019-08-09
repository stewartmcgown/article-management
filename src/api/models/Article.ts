import { IsNotEmpty } from 'class-validator';
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
    public id: string;

    @CreateDateColumn()
    @Column()
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
    @Column({
        nullable: true,
    })
    public modified: Date;

    @ManyToMany(type => Editor)
    @JoinTable()
    public editors: Editor[];

    @ManyToMany(type => Author)
    @JoinTable()
    public authors: Author[];
}
