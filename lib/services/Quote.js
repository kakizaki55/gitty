const fetch = require('cross-fetch');

module.exports = class Quote {
  author;
  content;
  constructor({ author, content }) {
    this.author = author;
    this.content = content;
  }

  static async getAll() {
    const apiArray = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://quotes.rest/qod?language=en',
      'https://api.quotable.io/random',
    ];
    const arrayOfPromises = apiArray.map((api) => fetch(api));

    const array = await Promise.all(arrayOfPromises).then((response) => {
      return Promise.all(response.map((item) => item.json()));
    });
    console.log('array', array);

    const formattedArray = array.map((item) => {
      if (item.success) {
        return {
          author: item.contents.quotes[0].author,
          content: item.contents.quotes[0].quote,
        };
      } else if (item.author) {
        return { author: item.author, content: item.content || item.en };
      } else {
        return { author: 'not a author', content: 'you didnt get a quote' };
      }
    });

    return formattedArray;
  }
};
