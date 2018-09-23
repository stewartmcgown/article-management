class Article {
    constructor(args) {
        this.title = null;
        this.data = null;
        this.subject = null;
        this.type = null;
        this.author = null;
        this.status = null;
        this.link = null;
        this.deadline = null;
        this.notes = null;
        this.id = null;
        this.markingGrid = null;
        this.copyright = null;

        Object.assign(this, args)
    }

    setDeadline(date) {
        this.deadline = date;
    }

    fromRow(row) {
        this.date = row[0];
        this.title = row[1];
        this.subject = row[2];
        this.type = row[3];
        this.author = new Author({name: row[4], school: row[5], email: row[6]});
        this.status = row[7];
        this.link = row[8];
        this.editor = new Editor({name: row[9], email: row[10]});
        this.deadline = row[11];
        this.notes = row[12];
        this.id = row[13];
        this.markingGrid = row[14];
        this.copyright = row[15];
    }
}
