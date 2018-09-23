export default class AMS {
  constructor() {

  }

  verifyAPICredentials(sessionKey) {

  }


  getAllArticles() {
      // Apps script code to get stuff
      const data = this.getSheetAsArray(this.getDatabaseId());
      
      const articles = [];

      for (let i = 1; i < data.length; i++) {
          const article = new Article();
          article.fromRow(data[i])
          articles.push(article)
      }

      return articles
  }
}