const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });

const products = [
  { name: 'Premium (72-96h)', description: 'Formule Premium - Lavage, séchage, repassage en 72-96h', unit_amount: 500, metadata: { service_type: 'premium', duration_hours: '72-96', price_per_kg: '5.00' } },
  { name: 'Express (24h)', description: 'Formule Express - Service complet en 24 heures', unit_amount: 1000, metadata: { service_type: 'express', duration_hours: '24', price_per_kg: '10.00' } },
  { name: 'Ultra Express (6h)', description: 'Formule Ultra Express - Service ultra-rapide en 6 heures', unit_amount: 1500, metadata: { service_type: 'ultra_express', duration_hours: '6', price_per_kg: '15.00' } }
];

async function createProducts() {
  console.log('🔄 Création des produits Stripe...\n');
  const createdProducts = [];

  for (const productData of products) {
    try {
      const product = await stripe.products.create({ name: productData.name, description: productData.description, metadata: productData.metadata });
      console.log(`✅ Produit créé: ${product.name} (${product.id})`);

      const price = await stripe.prices.create({ product: product.id, unit_amount: productData.unit_amount, currency: 'eur', metadata: productData.metadata });
      console.log(`   Price ID: ${price.id} - ${(productData.unit_amount / 100).toFixed(2)}€/kg\n`);

      createdProducts.push({ product, price, type: productData.metadata.service_type });
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 IDs à ajouter dans .env:\n');
  createdProducts.forEach((item) => {
    const typeUpper = item.type.toUpperCase();
    console.log(`VITE_STRIPE_PRODUCT_${typeUpper}=${item.product.id}`);
    console.log(`VITE_STRIPE_PRICE_${typeUpper}=${item.price.id}\n`);
  });
}

createProducts().catch(console.error);
