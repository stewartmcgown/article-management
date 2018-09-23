class Person {
    constructor(args) {
        this.id = null;
        this.name = null
        this.school = null
        this.organisation = null
        this.email = null
        this.age = null
        this.country = null
        this.bio = null
        this.photo = null
        this.hub = null
        this.articles = []

        Object.assign(this, args)
    }

    getPhotoBlob() {
        return this.photo.blob()
    }
}
