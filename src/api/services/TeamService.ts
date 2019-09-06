import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Team } from '../models/Team';
import { TeamRepository } from '../repositories/TeamRepository';
import { events } from '../subscribers/events';
import { AbstractService } from './AbstractService';

@Service()
export class TeamService extends AbstractService<Team> {

    constructor(
        @OrmRepository() private teamRepository: TeamRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { super(teamRepository) }

    public async create(team: Team): Promise<Team> {
        team.id = uuid.v1();
        await this.teamRepository.save(team);
        this.eventDispatcher.dispatch(events.team.created, team);
        return team;
    }

}
