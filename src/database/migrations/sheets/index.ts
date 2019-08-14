import csvtojson from 'csvtojson';
import { readdirSync } from 'fs';
import { join } from 'path';

export const run = () => {
    const csvFiles = readdirSync(join(__dirname, 'raw'));

    csvFiles.forEach(filename => {
        csvtojson().fromFile(join(__dirname, '/raw/', filename)).then(json => {
            console.log(json);
        })
    })
}
