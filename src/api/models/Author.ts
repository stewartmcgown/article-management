import { IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { User } from './User';

@Entity()
export class Author extends User {

    @Column()
    @IsNotEmpty()
    public school: string;

    @Column()
    @IsNotEmpty()
    public biography: string;

    @Column()
    @IsNotEmpty()
    public country: string;

    @Column()
    public teacher: string;

    @Column()
    public profile: string;
}
