const { Op } = require('sequelize');
const Sale = require('../models/Sale');
const { sequelize } = require('../config/database');

class SalesService {
  /**
   * Get sales with advanced filtering, search, sorting, and pagination
   */
  async getSales(queryParams) {
    const {
      search = '',
      customerRegion = [],
      gender = [],
      ageMin,
      ageMax,
      productCategory = [],
      tags = [],
      paymentMethod = [],
      dateFrom,
      dateTo,
      sortBy = 'date',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = queryParams;

    // Build WHERE clause
    const whereClause = {};
    const searchConditions = [];

    // Search: Customer Name OR Phone Number
    if (search && search.trim() !== '') {
      searchConditions.push(
        { customerName: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } }
      );
    }

    // Filters
    if (customerRegion && customerRegion.length > 0) {
      whereClause.customerRegion = { [Op.in]: customerRegion };
    }

    if (gender && gender.length > 0) {
      whereClause.gender = { [Op.in]: gender };
    }

    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age[Op.gte] = parseInt(ageMin);
      if (ageMax) whereClause.age[Op.lte] = parseInt(ageMax);
    }

    if (productCategory && productCategory.length > 0) {
      whereClause.productCategory = { [Op.in]: productCategory };
    }

    if (tags && tags.length > 0) {
      whereClause.tags = { [Op.in]: tags };
    }

    if (paymentMethod && paymentMethod.length > 0) {
      whereClause.paymentMethod = { [Op.in]: paymentMethod };
    }

    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) whereClause.date[Op.gte] = dateFrom;
      if (dateTo) whereClause.date[Op.lte] = dateTo;
    }

    // Combine search and filters
    const finalWhereClause = searchConditions.length > 0
      ? { [Op.and]: [{ [Op.or]: searchConditions }, whereClause] }
      : whereClause;

    // Sorting
    const orderClause = this.buildOrderClause(sortBy, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;

    try {
      // Get paginated results
      const { count, rows } = await Sale.findAndCountAll({
        where: finalWhereClause,
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        raw: true
      });

      // Get aggregated statistics
      const stats = await this.getAggregatedStats(finalWhereClause);

      return {
        sales: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        },
        stats
      };
    } catch (error) {
      throw new Error(`Failed to fetch sales: ${error.message}`);
    }
  }

  /**
   * Get aggregated statistics
   */
  async getAggregatedStats(whereClause) {
    try {
      const result = await Sale.findOne({
        where: whereClause,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalUnits'],
          [sequelize.fn('SUM', sequelize.col('final_amount')), 'totalAmount'],
          [sequelize.fn('SUM', 
            sequelize.literal('total_amount - final_amount')
          ), 'totalDiscount']
        ],
        raw: true
      });

      return {
        totalUnits: parseInt(result.totalUnits) || 0,
        totalAmount: parseFloat(result.totalAmount) || 0,
        totalDiscount: parseFloat(result.totalDiscount) || 0
      };
    } catch (error) {
      console.error('Stats calculation error:', error);
      return {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0
      };
    }
  }

  /**
   * Get unique filter values
   */
  async getFilterOptions() {
    try {
      const [regions, genders, categories, tagsList, paymentMethods] = await Promise.all([
        Sale.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('customer_region')), 'value']],
          where: { customerRegion: { [Op.ne]: null } },
          raw: true
        }),
        Sale.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('gender')), 'value']],
          where: { gender: { [Op.ne]: null } },
          raw: true
        }),
        Sale.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('product_category')), 'value']],
          where: { productCategory: { [Op.ne]: null } },
          raw: true
        }),
        Sale.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('tags')), 'value']],
          where: { tags: { [Op.ne]: null } },
          raw: true
        }),
        Sale.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('payment_method')), 'value']],
          where: { paymentMethod: { [Op.ne]: null } },
          raw: true
        })
      ]);

      return {
        customerRegions: regions.map(r => r.value).filter(Boolean),
        genders: genders.map(g => g.value).filter(Boolean),
        productCategories: categories.map(c => c.value).filter(Boolean),
        tags: tagsList.map(t => t.value).filter(Boolean),
        paymentMethods: paymentMethods.map(p => p.value).filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Failed to fetch filter options: ${error.message}`);
    }
  }

  /**
   * Build ORDER clause based on sortBy parameter
   */
  buildOrderClause(sortBy, sortOrder) {
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    switch (sortBy) {
      case 'date':
        return [['date', order]];
      case 'quantity':
        return [['quantity', order]];
      case 'customerName':
        return [['customerName', order === 'DESC' ? 'DESC' : 'ASC']];
      default:
        return [['date', 'DESC']];
    }
  }
}

module.exports = new SalesService();