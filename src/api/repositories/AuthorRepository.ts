import { EntityRepository, Repository } from 'typeorm';

import { Author } from '../models/Author';

@EntityRepository(Author)
export class AuthorRepository extends Repository<Author>  {

}
