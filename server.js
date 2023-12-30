const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8000;

const apiUrl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';

// Use cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());

app.get('/api/products', async (req, res) => {
    try {
        // Fetch JSON data from the API
        const response = await axios.get(apiUrl);

        // Check if the response contains product data
        if (response.data && response.data.products) {
            const products = Object.values(response.data.products);

            // Sort products by descending popularity
            const sortedProducts = products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

            // Extract title and price, and send as JSON
            const simplifiedData = sortedProducts.map(product => ({
                title: product.title,
                price: product.price,
                popularity: product.popularity,
            }));

            res.json(simplifiedData);
        } else {
            res.status(500).json({ error: 'Invalid data format received from the API.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
