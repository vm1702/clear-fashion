const dedicatedbrand = require('./eshops/Dedicated_brand');
const fs = require('fs').promises;

async function sandbox(eshops) {
  try {
    for (let i = 0; i < eshops.length; i++) {
      const eshop = eshops[i];
      console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

      const products = await dedicatedbrand.scrape(eshop);

      console.log(products);

      // Convert the products array to JSON format
      const jsonProducts = JSON.stringify(products);

      // Write the JSON data to a file named after the eshop's name
      const eshopName = eshop.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
      await fs.writeFile(`products_${eshopName}.json`, jsonProducts, 'utf8');
      console.log(`File for ${eshop} saved successfully!`);
    }

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const baseUrl = 'https://www.dedicatedbrand.com/en/';
const eshops = [];

for (let gender of ['men', 'women']) {
  for (let page = 1; page <= 17; page++) {
    eshops.push(`${baseUrl}${gender}/all-${gender}#page=${page}`);
  }
}
eshops.push(
  `${baseUrl}women/all-women#page=18`,
  `${baseUrl}women/all-women#page=19`,
  `${baseUrl}kids/t-shirts`,
  `${baseUrl}kids/sweatshirts`,
  `${baseUrl}kids/bottoms`,
  `${baseUrl}kids/swimwear`,
  `${baseUrl}kids/sale`
);

sandbox(eshops);

