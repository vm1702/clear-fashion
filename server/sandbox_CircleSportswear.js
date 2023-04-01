const Circlebrand = require('./eshops/CircleSportswear_brand');
const fs = require('fs').promises;

async function sandbox (eshops) {
    try {
        for (let i = 0; i < eshops.length; i++) {
            console.log(`🕵️‍♀️  browsing ${eshops[i]} eshop`);

            const products = await Circlebrand.scrape(eshops[i]);

            console.log(products);

            // Convert the products array to JSON format
            const jsonProducts = JSON.stringify(products);

            // Write the JSON data to a file named after the eshop's name
            const eshopName = eshops[i].replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
            await fs.writeFile(`products_${eshopName}.json`, jsonProducts, 'utf8');

            console.log(`File for ${eshops[i]} saved successfully!`);
        }

        console.log('done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const eshops = [
    'https://shop.circlesportswear.com/collections/all'
];

sandbox(eshops);