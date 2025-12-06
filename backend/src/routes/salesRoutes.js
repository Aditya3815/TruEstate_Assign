const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET /api/sales - Get sales with filters, search, sort, pagination
router.get('/', salesController.getSales.bind(salesController));

// GET /api/sales/filters - Get available filter options
router.get('/filters', salesController.getFilterOptions.bind(salesController));

module.exports = router;