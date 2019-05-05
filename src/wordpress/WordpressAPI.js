const wordpress = require('wordpress')

class WordpressAPI {
  constructor(params) {
    this.client = wordpress.createClient({
      url: 'https://ysjournal.com',
      username: 'submissions',
      password:
        process.env.wp_password || require('../../wordpress.json').password
    })
  }

  /**
   * Creates a post on the server for an article.
   *
   * @param {Object} data
   * @returns {Promise}
   */
  createPost(data) {
    return new Promise((resolve, reject) => {
      this.client.newPost(data, (error, data) => resolve(!error))
    })
  }
}

module.exports = WordpressAPI
