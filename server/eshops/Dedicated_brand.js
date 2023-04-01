const fetch = require('node-fetch');
const cheerio = require('cheerio');
const brand = "Dedicated Brand";

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);

    return $('.productList-container .productList')
        .map((i, element) => {
            const name = $(element)
                .find('.productList-title')
                .text()
                .trim()
                .replace(/\s/g, ' ');
            const price = parseInt(
                $(element)
                    .find('.productList-price')
                    .text()
            );
            let link= $(element)
                .find('.productList-link')
                .attr("href")
            let photo = $(element)
                .find('img')
                .attr('data-src')
            return {link, brand, price, name, photo};
        })
        .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};