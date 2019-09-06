import { Field } from 'type-graphql';
import { Column, Entity, ManyToMany, Unique } from 'typeorm';

import { AbstractModel } from './AbstractModel';
import { Editor } from './Editor';

/**
 * Teams are organisational units. For example, editors belong to one team whilst
 * devops belong to another. Reviewers who do not edit can belong to another team.
 */
@Entity()
@Unique(['name'])
export class Team extends AbstractModel {

    @Column()
    public name: string;

    @ManyToMany(type => Editor)
    @Field(type => [Editor])
    public editors: Editor[];
}
