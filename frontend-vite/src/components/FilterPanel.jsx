import { ChevronDown, RotateCcw } from 'lucide-react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filterOptions, activeFilters, onFilterChange, onClearFilters }) => {

  const handleSelectChange = (key, value) => {
    // For multi-selects, we might need different logic, but simple select for now
    // If value is "", remove from filters
    if (value === "") {
      const newFilters = { ...activeFilters };
      delete newFilters[key]; // or set to empty array depending on App logic
      // helper to handle array vs string
      if (Array.isArray(activeFilters[key])) {
        onFilterChange({ [key]: [] });
      } else {
        onFilterChange({ [key]: '' });
      }
      return;
    }

    // App expects arrays for some filters
    if (['customerRegions', 'genders', 'productCategories', 'paymentMethods'].includes(key + 's')) {
      onFilterChange({ [key]: [value] });
    } else {
      onFilterChange({ [key]: value });
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-scroll-container">
        <button className="reset-btn" onClick={onClearFilters} title="Reset Filters">
          <RotateCcw size={16} />
        </button>

        {/* Customer Region */}
        <div className="filter-group">
          <select
            value={activeFilters.customerRegion?.[0] || ''}
            onChange={(e) => handleSelectChange('customerRegion', e.target.value)}
            className="filter-select"
          >
            <option value="">Customer Region</option>
            {filterOptions.customerRegions?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Gender */}
        <div className="filter-group">
          <select
            value={activeFilters.gender?.[0] || ''}
            onChange={(e) => handleSelectChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="">Gender</option>
            {filterOptions.genders?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Age Range - Hardcoded for demo/simplicity or derived */}
        <div className="filter-group">
          <select
            value={activeFilters.ageMin ? `${activeFilters.ageMin}-${activeFilters.ageMax}` : ''}
            onChange={(e) => {
              if (!e.target.value) {
                onFilterChange({ ageMin: '', ageMax: '' });
                return;
              }
              const [min, max] = e.target.value.split('-');
              onFilterChange({ ageMin: min, ageMax: max });
            }}
            className="filter-select"
          >
            <option value="">Age Range</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-50">36-50</option>
            <option value="50-100">50+</option>
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Product Category */}
        <div className="filter-group">
          <select
            value={activeFilters.productCategory?.[0] || ''}
            onChange={(e) => handleSelectChange('productCategory', e.target.value)}
            className="filter-select"
          >
            <option value="">Product Category</option>
            {filterOptions.productCategories?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Tags */}
        <div className="filter-group">
          <select
            value={activeFilters.tags?.[0] || ''}
            onChange={(e) => handleSelectChange('tags', e.target.value)}
            className="filter-select"
          >
            <option value="">Tags</option>
            {filterOptions.tags?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Payment Method */}
        <div className="filter-group">
          <select
            value={activeFilters.paymentMethod?.[0] || ''}
            onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
            className="filter-select"
          >
            <option value="">Payment Method</option>
            {filterOptions.paymentMethods?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>

        {/* Date - Simple placeholder for now */}
        <div className="filter-group">
          <select
            className="filter-select"
            disabled // Placeholder
          >
            <option>Date</option>
          </select>
          <ChevronDown size={14} className="filter-arrow" />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;