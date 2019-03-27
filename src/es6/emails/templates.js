const Editor = require("../people/Editor")
const Article = require("../Article")
const { get } = require("../utils/Utils")

module.exports = class Templates {
    static templateKey(key) {
        return `<!doctype html><html><body>
                    <p><strong>Your authentication key is: ${key}</strong>

                    <p>If you didn't request this key, don't worry, as no one can gain access to your account
                    without it.
                </body></html>`
    }

    static genericUpdate() {

    }

    /**
     * 
     * @param {Object} o
     * @param {Article} o.article 
     */
    static updateArticle({ article, modified }) {
        return `<!DOCTYPE html>
<html>
    <head>
        <base target="_top">
        
        
    </head>
    <body>
        <div class="container" style="width: 100%;font-family: sans-serif;">
            ${Components.header()}
            <p>Dear ${get(["author", "name"], article) ? article.author.name : "Author"},</p>

            <p>An article you have submitted, <a href="${article.link}" style="text-decoration: none;color: #d13619;border-bottom: 2px #d13619 solid;">${article.title}</a>, 
                has been updated. The following properties have changed:</p>

                <ul>
                    ${modified.map(item => `
                        <li><strong style="text-transform: capitalize">${item.key.replace("_", " ")}</strong> changed to <strong>${item.value}</strong>.</li>
                      `).join('')}
                </ul>

            <p>Please check if you have recieved any comments on your article.</p>

            <p>Your editor is <strong><a href="mailto:${article.editor.email}">${article.editor ? article.editor.name : "currently unavailable"}</a></strong>.</p>
            
            <p><em>This is an automated email and will not be replied to.</em></p>
        </div>
    </body>`
    }

    static updateEditor() {

    }

    /**
     * 
     * @param {Object} o 
     * @param {Editor} o.editor
     */
    static createEditor({ editor }) {
return `
            <!DOCTYPE html>
<html>
    <head>
        <base target="_top">
        
        
    </head>
    <body>
        <div class="container" style="width: 100%;font-family: sans-serif;">
            ${Components.header()}
            <p>Dear ${ editor.name },</p>

            <p>Your <strong>${editor.level ? editor.level + " " : ""}Editor</strong> account at the Young Scientists Journal has just been created.</p>
            <p>You can log in to your new account using the button below. You will be prompted to enter your email address. Once you have done so, enter the code that is sent to your email.</p>
            <p>Happy Editing!</p>
            
            <a class="button" href="https://manage.ysjournal.com" style="text-decoration: none;color: white;border-bottom: 2px #d13619 solid;border-radius: 4px;background: #d13619;padding: 8px;">Manage Articles</a>
            
            <p><em>This is an automated email and will not be replied to.</em></p>
        </div>
    </body>
        `
    }
}

const Components = {
    header() {
        return `<div class="header" style="background: #d13619;text-align: center;">
        <img src="https://assets.ysjournal.com/emails/logo-transparent.png" style="margin: 0 auto;">
    </div>`
    }
}