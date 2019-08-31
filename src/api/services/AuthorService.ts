import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Author } from '../models/Author';
import { AuthorRepository } from '../repositories/AuthorRepository';
import { events } from '../subscribers/events';

@Service()
export class AuthorService {

    constructor(
        @OrmRepository() private authorRepository: AuthorRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Author[]> {
        this.log.info('Find all authors');
        return this.authorRepository.find();
    }

    public findByEmail(email: string): Promise<Author> {
        return this.authorRepository.findOne({
            where: {
                email,
            },
        });
    }

    public findOne(id: string): Promise<Author | undefined> {
        this.log.info('Find one author');
        return this.authorRepository.findOne({ id });
    }

    public async create(author: Author): Promise<Author> {
        this.log.info('Create a new author => ', author.toString());
        author.id = uuid.v1();
        const newAuthor = await this.authorRepository.save(author);
        this.eventDispatcher.dispatch(events.author.created, newAuthor);
        return newAuthor;
    }

    public update(id: string, author: Author): Promise<Author> {
        this.log.info('Update a author');
        author.id = id;
        return this.authorRepository.save(author);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a author');
        await this.authorRepository.delete(id);
        return;
    }

}
