import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put
} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { Levels } from '../models/enums/Levels';
import { Team } from '../models/Team';
import { TeamService } from '../services/TeamService';

@Authorized(Levels.JUNIOR)
@JsonController('/teams')
export class TeamController {

    constructor(
        private teamService: TeamService
    ) { }

    @Get()
    public find(): Promise<Team[]> {
        return this.teamService.find();
    }

    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    public one(@Param('id') id: string): Promise<Team | undefined> {
        return this.teamService.findOne(id);
    }

    @Authorized(Levels.ADMIN)
    @Post()
    public create(@Body() team: Team): Promise<Team> {
        return this.teamService.create(team);
    }

    @Authorized(Levels.ADMIN)
    @Put('/:id')
    public update(@Param('id') id: string, @Body() team: Team): Promise<Team> {
        return this.teamService.update(id, team);
    }

    @Authorized(Levels.ADMIN)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.teamService.delete(id);
    }

}
