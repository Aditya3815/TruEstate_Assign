const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Transaction ID
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'transaction_id'
  },
  
  // Customer Fields
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_id',
    index: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name',
    index: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'phone_number',
    index: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    index: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    index: true
  },
  customerRegion: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'customer_region',
    index: true
  },
  customerType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'customer_type'
  },
  
  // Product Fields
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_id'
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_name'
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  productCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'product_category',
    index: true
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    index: true
  },
  
  // Sales Fields
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    index: true
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_unit'
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'discount_percentage'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'final_amount'
  },
  
  // Operational Fields
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    index: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_method',
    index: true
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'order_status'
  },
  deliveryType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'delivery_type'
  },
  storeId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'store_id'
  },
  storeLocation: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'store_location'
  },
  salespersonId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'salesperson_id'
  },
  employeeName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'employee_name'
  }
}, {
  tableName: 'sales',
  timestamps: false,
  indexes: [
    {
      name: 'idx_customer_name',
      fields: ['customer_name']
    },
    {
      name: 'idx_phone_number',
      fields: ['phone_number']
    },
    {
      name: 'idx_date',
      fields: ['date']
    },
    {
      name: 'idx_customer_region',
      fields: ['customer_region']
    },
    {
      name: 'idx_product_category',
      fields: ['product_category']
    }
  ]
});

module.exports = Sale;