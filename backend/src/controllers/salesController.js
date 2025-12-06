const salesService = require('../services/salesService');

class SalesController {
  /**
   * GET /api/sales
   * Get sales with filters, search, sort, and pagination
   */
  async getSales(req, res) {
    try {
      // Parse query parameters
      const queryParams = {
        search: req.query.search || '',
        customerRegion: req.query.customerRegion ? 
          (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : [req.query.customerRegion]) : [],
        gender: req.query.gender ? 
          (Array.isArray(req.query.gender) ? req.query.gender : [req.query.gender]) : [],
        ageMin: req.query.ageMin,
        ageMax: req.query.ageMax,
        productCategory: req.query.productCategory ? 
          (Array.isArray(req.query.productCategory) ? req.query.productCategory : [req.query.productCategory]) : [],
        tags: req.query.tags ? 
          (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
        paymentMethod: req.query.paymentMethod ? 
          (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : [req.query.paymentMethod]) : [],
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        sortBy: req.query.sortBy || 'date',
        sortOrder: req.query.sortOrder || 'DESC',
        page: req.query.page || 1,
        limit: req.query.limit || 10
      };

      const result = await salesService.getSales(queryParams);

      res.status(200).json({
        success: true,
        data: result.sales,
        pagination: result.pagination,
        stats: result.stats
      });
    } catch (error) {
      console.error('Get sales error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch sales data'
      });
    }
  }

  /**
   * GET /api/sales/filters
   * Get available filter options
   */
  async getFilterOptions(req, res) {
    try {
      const options = await salesService.getFilterOptions();
      
      res.status(200).json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('Get filter options error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch filter options'
      });
    }
  }
}

module.exports = new SalesController();