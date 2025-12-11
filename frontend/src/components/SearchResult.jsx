import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";

const SearchResult = ({ searchTerm, navigateUrl, setSearchTerm }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  // 🔹 Debounce input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 🔹 Fetch search results
  const fetchResults = useCallback(async () => {
    if (!debouncedTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/api/search`, {
        params: { keyword: debouncedTerm },
      });
      setResults(data?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedTerm]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // 🔹 Handle navigation on click
  const handleClick = (item) => {
    setSearchTerm("");
    setHoveredIndex(null);
    navigate(`/${navigateUrl}/${item._id}`);
  };

  if (!searchTerm) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <ul className="space-y-1">
          {results.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <li
                key={item._id || index}
                onClick={() => handleClick(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded cursor-pointer transition-all duration-150 ${
                  isHovered
                    ? "bg-blue-100 text-blue-800 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name || JSON.stringify(item)}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchResult;
