import { EntityRepository, Repository } from 'typeorm';

import { Team } from '../models/Team';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team>  {

}
