/**
 * AMS will handle all AMS specific actions when called by the Router.
 * 
 * @author Stewart McGown
 * @see https://drive.google.com/open?id=1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU
 */
export default class AMS {
  constructor() {

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