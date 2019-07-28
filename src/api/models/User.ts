import { IsNotEmpty } from 'class-validator';
import { Column, PrimaryColumn } from 'typeorm';

export abstract class User {

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @Column()
    public email: string;

}
