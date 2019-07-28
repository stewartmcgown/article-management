import { IsNotEmpty } from 'class-validator';
import { Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './User';

export class AuthToken {

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public token: string;

    @OneToOne(type => User)
    @JoinColumn()
    public user: User;

}
