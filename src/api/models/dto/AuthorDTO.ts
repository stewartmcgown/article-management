import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'routing-controllers/node_modules/class-transformer';

@Exclude()
export class AuthorDTO {

    @Expose()
    @IsNotEmpty()
    public name: string;

    @Expose()
    @IsNotEmpty()
    public email: string;

    @Expose()
    @IsNotEmpty()
    public school: string;

    @Expose()
    @IsNotEmpty()
    public biography: string;

    @Expose()
    @IsNotEmpty()
    public country: string;
}
