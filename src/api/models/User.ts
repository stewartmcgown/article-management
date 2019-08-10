import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, PrimaryColumn } from 'typeorm';

export abstract class User {

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    public email: string;

    @Column({ nullable: true })
    public lastPinIssued: Date;

    @Column({ nullable: true, select: false })
    public secret: string;

    @Column({ nullable: true, select: false })
    public token: string;

}
