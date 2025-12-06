import { Copy } from 'lucide-react';
import '../styles/SalesTable.css';

const SalesTable = ({ sales }) => {

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const formatDate = (dateString) => {
    // Assuming YYYY-MM-DD
    return dateString;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="sales-table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer Region</th>
            <th>Product ID</th>
            <th>Employee Name</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id || sale.transactionId}>
              <td>{sale.transactionId}</td>
              <td>{formatDate(sale.date)}</td>
              <td>{sale.customerId}</td>
              <td className="font-medium">{sale.customerName}</td>
              <td>
                <div className="phone-cell">
                  <span>{sale.phoneNumber && `+91 ${sale.phoneNumber}`}</span>
                  <button className="copy-btn" onClick={() => copyToClipboard(sale.phoneNumber)}>
                    <Copy size={12} />
                  </button>
                </div>
              </td>
              <td>{sale.gender}</td>
              <td>{sale.age}</td>
              <td className="font-medium">{sale.productCategory}</td>
              <td className="font-bold text-center">{sale.quantity ? String(sale.quantity).padStart(2, '0') : '00'}</td>
              <td className="font-medium">{formatCurrency(sale.totalAmount)}</td>
              <td className="font-medium">{sale.customerRegion}</td>
              <td>{sale.productId}</td>
              <td>{sale.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;