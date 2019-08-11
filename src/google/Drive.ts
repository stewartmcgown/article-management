import { GaxiosResponse } from 'gaxios';
import { drive_v3, google } from 'googleapis';
import { MethodOptions, OAuth2Client } from 'googleapis-common';
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

export interface ShareFileOptions {
    id: string;

    role: 'fileOrganizer' | 'writer' | 'commenter' | 'reader';

    email: string;
}

export interface DownloadFileOptions {
    id: string;

    mimeType: string;
}

const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));

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

        this.drive = google.drive({
            version: 'v3',
            auth: this.oAuth,
        });
    }

    public shareFile(options: ShareFileOptions): Promise<string> {
        return this.executeDriveRequest(this.drive.permissions.create({
            fileId: options.id,
            requestBody: {
                role: options.role,
                type: 'user',
                emailAddress: options.email,
            },
            fields: 'id',
        }));
    }

    public createFolder(options: CreateFolderOptions): Promise<string> {
        return this.executeDriveRequest(this.drive.files.create({
            auth: this.oAuth,
            requestBody: {
                name: options.name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [options.parentId],
            },
            fields: 'id',
        }));
    }

    public createFile(options: CreateFileOptions): Promise<string> {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(options.file.buffer);

        return this.executeDriveRequest(this.drive.files.create({
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
        }));
    }

    public copy(options: CopyFileOptions): Promise<string> {
        return this.executeDriveRequest(this.drive.files.copy({
            fileId: options.source,
            requestBody: {
                name: options.name,
                parents: [options.dest],
            },
            fields: 'id',
        }));
    }

    public downloadFile(options: DownloadFileOptions): Promise<ArrayBuffer> {
        const resource = {
            fileId: options.id,
            mimeType: options.mimeType,
        };

        const request: MethodOptions = {
            responseType: 'arraybuffer',
        };

        return new Promise((resolve, reject) => {
            this.drive.files.export(resource, request, (err, res) => {
                resolve((res.data as unknown) as ArrayBuffer);
            });
        });
    }

    private async executeDriveRequest(request: Promise<GaxiosResponse<any>>): Promise<any> {
        await sleep(500);
        return request.then(d => d.data.id);
    }
}
