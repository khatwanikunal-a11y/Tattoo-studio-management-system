const express = require('express');
const router = express.Router();
const Design = require('../models/Design');

const BASE_PRICES = { small: 80, medium: 200, large: 450 };
const STYLE_MULTIPLIERS = {
  'realism': 1.5, 'japanese': 1.4, 'neo-traditional': 1.3,
  'watercolour': 1.3, 'geometric': 1.2, 'blackwork': 1.1,
  'dotwork': 1.2, 'traditional': 1.0
};
const EXCHANGE_API = 'https://open.er-api.com/v6/latest/EUR';

function calculatePrice(size, style, yearsExp) {
  const base = BASE_PRICES[size] || BASE_PRICES['medium'];
  const mult = STYLE_MULTIPLIERS[style.toLowerCase().trim()] || 1.0;
  const expBonus = 1 + (Math.min(yearsExp, 30) * 0.02);
  return Math.round(base * mult * expBonus * 100) / 100;
}

// GET /api/pricing/estimate?design_id=&currency=
router.get('/estimate', async (req, res, next) => {
  const { design_id, currency = 'EUR' } = req.query;
  if (!design_id) return res.status(400).json({ error: 'design_id query parameter is required' });

  try {
    const design = await Design.findById(design_id).populate('artist_id');
    if (!design) return res.status(404).json({ error: 'Design not found' });

    const yearsExp = design.artist_id ? design.artist_id.years_exp : 0;
    const priceEur = calculatePrice(design.size, design.style, yearsExp);
    const cur = currency.toUpperCase().trim();

    if (cur === 'EUR') {
      return res.status(200).json({
        design_id: design._id, size: design.size, style: design.style,
        artist_years_exp: yearsExp, price: priceEur, currency: 'EUR'
      });
    }

    const resp = await fetch(EXCHANGE_API);
    const data = await resp.json();
    const rate = data.rates && data.rates[cur];
    if (!rate) return res.status(400).json({ error: `Unsupported currency: ${cur}` });
    const converted = Math.round(priceEur * rate * 100) / 100;
    res.status(200).json({
      design_id: design._id, size: design.size, style: design.style,
      artist_years_exp: yearsExp, price_eur: priceEur,
      price: converted, currency: cur, exchange_rate: rate
    });
  } catch (err) { next(err); }
});

module.exports = router;
