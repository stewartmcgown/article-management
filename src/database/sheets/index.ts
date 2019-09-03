import { join } from 'path';
import Container from 'typedi';

import { Article } from '../../api/models/Article';
import { Author } from '../../api/models/Author';
import { Editor } from '../../api/models/Editor';
import { Levels, Positions } from '../../api/models/enums';
import { ArticleRepository } from '../../api/repositories/ArticleRepository';

import uuid = require('uuid');
export interface OldAuthor {
    email: string;
    name: string;
    school: string;
    biography: string;
    country: string;
    teacher: string;
    profile: string;
}

export interface OldEditor {
    name: string;
    email: string;
    position: string;
    level: string;
    totalEdited: number;
    currentlyEditing: number;
    subjects: string;
}

export interface OldArticle {
    date: string;
    title: string;
    subject: string;
    type: string;
    status: string;
    id: string;
    notes: string;
    folderId: string;
    markingGrid: string;
    copyright: string;
    trashed: boolean;
    summary: string;
    reason: string;
    modified: string;
    link: string;
    authors: OldAuthor[];
    editors: OldEditor[];
}

export const oldEditorToNew = (old: OldEditor): Editor => {
    const a = new Editor();
    a.id = uuid.v4();
    a.email = old.email;
    a.level = Levels[old.level.toUpperCase()];
    a.name = old.name;
    a.position = Positions[old.position.toUpperCase()];
    a.subjects = old.subjects;

    return a;
};

export const oldAuthorToNew = (old: OldAuthor): Author => {
    const a = new Author();
    a.id = uuid.v4();
    a.biography = old.biography;
    a.country = old.country;
    a.email = old.email;
    a.level = Levels.AUTHOR;
    a.name = old.name;
    a.profile = old.profile;
    a.school = old.school;
    a.teacher = old.teacher;

    return a;
};

export const oldArticleToNew = (old: OldArticle): Article => {
    const a = new Article();
    Object.keys(a).forEach(k => old[k] ? a[k] = old[k] : undefined);
    a.id = uuid.v4();
    a.date = new Date(old.date);
    a.docId = old.id;

    a.authors = old.authors.map(author => oldAuthorToNew(author));
    a.editors = old.editors.map(editor => oldEditorToNew(editor));

    return a;
};

export const run = async () => {
    const articles: OldArticle[] = await import(join(__dirname, '/raw/db.json'));

    const articleRepo = Container.get(ArticleRepository);

    const newArticles: Article[] = articles.map(old => oldArticleToNew(old));

    await articleRepo.save(newArticles);
};
