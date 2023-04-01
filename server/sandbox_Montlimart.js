const Montlimartbrand = require('./eshops/Montlimart_brand');
const fs = require('fs').promises;

async function sandbox(eshops) {
    try {
        for (let i = 0; i < eshops.length; i++) {
            const eshop = eshops[i];
            console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

            const products = await Montlimartbrand.scrape(eshop);

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

const eshops = [
    'https://www.montlimart.com/99-vetements',
    'https://www.montlimart.com/14-chaussures',
    'https://www.montlimart.com/15-accessoires'
    
];

sandbox(eshops);