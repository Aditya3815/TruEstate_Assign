import { ChevronDown } from 'lucide-react';
import '../styles/SortDropDown.css';

const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => {

  // Combine sortBy and sortOrder into a single value for the select
  const value = `${sortBy}-${sortOrder}`;

  const handleChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    onSortChange(newSortBy, newSortOrder);
  };

  return (
    <div className="sort-dropdown-container">
      <span className="sort-label">Sort by:</span>
      <div className="sort-select-wrapper">
        <select value={value} onChange={handleChange} className="sort-select">
          <option value="customerName-ASC">Customer Name (A-Z)</option>
          <option value="customerName-DESC">Customer Name (Z-A)</option>
          <option value="date-DESC">Date (Newest First)</option>
          <option value="date-ASC">Date (Oldest First)</option>
          <option value="totalAmount-DESC">Amount (High-Low)</option>
          <option value="totalAmount-ASC">Amount (Low-High)</option>
        </select>
        <ChevronDown size={14} className="sort-arrow" />
      </div>
    </div>
  );
};

export default SortDropdown;