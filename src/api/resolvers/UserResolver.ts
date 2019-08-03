import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { Editor as EditorModel } from '../models/Editor';
import { EditorService } from '../services/EditorService';
import { PetService } from '../services/PetService';
import { Editor } from '../types/Editor';

@Service()
@Resolver(of => Editor)
export class EditorResolver {

    constructor(
        private editorService: EditorService,
        private petService: PetService
        ) {}

    @Query(returns => [Editor])
    public editors(): Promise<any> {
      return this.editorService.find();
    }

    @FieldResolver()
    public async pets(@Root() editor: EditorModel): Promise<any> {
        return this.petService.findByEditor(editor);
    }

}
