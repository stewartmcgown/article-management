import { EntityRepository, Repository } from 'typeorm';

import { Editor } from '../models/Editor';

@EntityRepository(Editor)
export class EditorRepository extends Repository<Editor>  {

}
