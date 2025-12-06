import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import '../styles/SearchBar.css';

function SearchBar({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only call onChange if the value is different (optional check, but good practice)
      onChange(searchTerm);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  return (
    <div className="search-bar">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        placeholder="Name, Phone no."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;