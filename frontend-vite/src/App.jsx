import { useState, useEffect, useCallback } from 'react';
import { salesAPI } from './services/api';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import StatsCards from './components/StatsCards';
import SortDropdown from './components/SortDropDown';
import './styles/App.css';

function App() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    customerRegions: [],
    genders: [],
    productCategories: [],
    tags: [],
    paymentMethods: []
  });

  // Query state
  const [queryParams, setQueryParams] = useState({
    search: '',
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'DESC',
    page: 1,
    limit: 10
  });

  // Pagination and stats
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await salesAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  const fetchSales = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await salesAPI.getSales(params);
      setSales(response.data);
      setPagination(response.pagination);
      setStats(response.stats);
    } catch (err) {
      if (err.message !== 'canceled') {
        setError(err.message || 'Failed to fetch sales data');
        console.error('Fetch sales error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce fetch sales when queryParams change
  useEffect(() => {
    // Basic debounce to prevent rapid firing if multiple state updates happen
    const timer = setTimeout(() => {
      fetchSales(queryParams);
    }, 100);
    return () => clearTimeout(timer);
  }, [queryParams, fetchSales]);

  // Update query params - Memoized to prevent loop in SearchBar
  const updateQueryParams = useCallback((updates) => {
    setQueryParams(prev => {
      const newParams = {
        ...prev,
        ...updates,
        page: updates.page !== undefined ? updates.page : 1
      };
      // Simple equality check optimization could go here, but React handles it mostly
      return newParams;
    });
  }, []);

  // Handlers - Memoized
  const handleSearch = useCallback((searchTerm) => {
    updateQueryParams({ search: searchTerm, page: 1 });
  }, [updateQueryParams]);

  const handleFilterChange = useCallback((filters) => {
    updateQueryParams({ ...filters, page: 1 });
  }, [updateQueryParams]);

  const handleSortChange = useCallback((sortBy, sortOrder) => {
    updateQueryParams({ sortBy, sortOrder });
  }, [updateQueryParams]);

  const handlePageChange = useCallback((page) => {
    updateQueryParams({ page });
  }, [updateQueryParams]);

  const handleClearFilters = useCallback(() => {
    setQueryParams({
      search: '',
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'DESC',
      page: 1,
      limit: 10
    });
  }, []);

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>Sales Management System</h1>
          </div>
          <div className="header-search">
            <SearchBar
              value={queryParams.search}
              onChange={handleSearch}
            />
          </div>
        </header>

        <main className="content-area">
          <div className="stats-section">
            <StatsCards stats={stats} />
          </div>

          <div className="controls-section">
            <div className="filters-wrapper">
              <FilterPanel
                filterOptions={filterOptions}
                activeFilters={queryParams}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="sort-wrapper">
              <SortDropdown
                sortBy={queryParams.sortBy}
                sortOrder={queryParams.sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          <div className="table-wrapper">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading sales data...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={() => fetchSales(queryParams)}>Retry</button>
              </div>
            )}

            {!loading && !error && (
              <>
                <SalesTable sales={sales} />
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;