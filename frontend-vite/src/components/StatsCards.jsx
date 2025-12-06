import { Package, Banknote, Gift, Info } from 'lucide-react';
import '../styles/StatsCards.css';

const StatsCards = ({ stats }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
          <Package size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-label">Total units sold</p>
          <h3 className="stat-value">{formatNumber(stats.totalUnits)}</h3>
        </div>
        <div className="stat-info-icon">
          <Info size={16} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff7cd', color: '#d97706' }}>
          {/* Using Banknote as money bag alternative */}
          <Banknote size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-label">Total Amount</p>
          <h3 className="stat-value">{formatCurrency(stats.totalAmount)}</h3>
          <p className="stat-sub">(30,00,491 SRs)</p>
        </div>
        <div className="stat-info-icon">
          <Info size={16} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
          <Gift size={24} />
        </div>
        <div className="stat-content">
          <p className="stat-label">Total Discount</p>
          <h3 className="stat-value">{formatCurrency(stats.totalDiscount)}</h3>
          <p className="stat-sub">(30,00,491 SRs)</p>
        </div>
        <div className="stat-info-icon">
          <Info size={16} />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;