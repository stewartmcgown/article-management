import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
export class Article {

    @PrimaryColumn('uuid')
    public id: string;

    @CreateDateColumn()
    @Column()
    public date: Date;

    @IsNotEmpty()
    @Column()
    public title: string;

    @IsNotEmpty()
    @Column()
    public type: Type;

    @IsNotEmpty()
    @Column()
    public status: Status;

    @IsNotEmpty()
    @Column()
    public docId: string;

    @Column()
    public deadline: Date;

    @Column()
    public notes: string;

    @IsNotEmpty()
    @Column()
    public folderId: string;

    @IsNotEmpty()
    @Column()
    public markingGridId: string;

    @Column()
    public copyright: string;

    @Column()
    public trashed = false;

    @IsNotEmpty()
    @Column()
    public summary: string;

    @Column()
    public reason: string;

    @UpdateDateColumn()
    @Column()
    public modified: Date;

}
