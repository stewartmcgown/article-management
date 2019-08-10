import { drive_v3, google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import stream from 'stream';
import { Service } from 'typedi';

import { env } from '../env';

export interface CreateFileOptions {
    name: string;

    parentId: string;

    mimeType: string;

    file: Express.Multer.File;
}

export interface CreateFolderOptions {
    name: string;

    parentId: string;
}

export interface CopyFileOptions {
    source: string;

    dest: string;

    name?: string;
}

@Service()
export class Drive {

    private oAuth: OAuth2Client;

    private drive: drive_v3.Drive;

    constructor() {
        this.oAuth = new google.auth.OAuth2(
            env.google.client_id,
            env.google.client_secret,
            'http://localhost:8081/oauthCallback'
        );

        this.oAuth.setCredentials({
            refresh_token: env.google.refresh_token,
        });

        this.drive = google.drive('v3');
    }

    public createFolder(options: CreateFolderOptions): Promise<string> {
        return this.drive.files.create({
            auth: this.oAuth,
            requestBody: {
                name: options.name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [options.parentId],
            },
            fields: 'id',
        }).then(d => d.data.id);
    }

    public createFile(options: CreateFileOptions): Promise<string> {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(options.file.buffer);

        return this.drive.files.create({
            auth: this.oAuth,
            requestBody: {
                name: options.name,
                mimeType: options.mimeType,
                parents: [options.parentId],
            },
            media: {
                mimeType: options.file.mimetype,
                body: bufferStream,
            },
            fields: 'id',
        }).then(r => r.data.id);
    }

    public copy(options: CopyFileOptions): Promise<string> {
        return this.drive.files.copy({
            auth: this.oAuth,
            fileId: options.source,
            requestBody: {
                name: options.name,
                parents: [options.dest],
            },
            fields: 'id',
        }).then(r => r.data.id);
    }
}
