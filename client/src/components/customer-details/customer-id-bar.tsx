import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useCustomerIDList } from "../../hooks/customer-details/use-customer-id-list";

const CustomerInput = ({ setCustomerID }) => {
  const { data: customers, loading } = useCustomerIDList();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const suggestionRefs = useRef([]);

  // Filter customers based on the input query (case-insensitive)
  const filteredCustomers = query
    ? customers.filter((cust) =>
        cust.ID.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // When a customer is selected, update the input and hide suggestions.
  const handleSelect = (customer) => {
    setCustomerID(customer.ID);
    setQuery(customer.ID);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  // Update query and reset active suggestion.
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setActiveSuggestion(-1);
  };

  // Handle keyboard navigation and allow direct input acceptance.
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeSuggestion < filteredCustomers.length - 1) {
        setActiveSuggestion(activeSuggestion + 1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeSuggestion > 0) {
        setActiveSuggestion(activeSuggestion - 1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        activeSuggestion >= 0 &&
        activeSuggestion < filteredCustomers.length
      ) {
        // If a suggestion is highlighted, select it.
        handleSelect(filteredCustomers[activeSuggestion]);
      } else if (query.trim() !== "") {
        // Otherwise, accept the typed value directly.
        setCustomerID(query);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Auto-scroll the active suggestion into view when it changes.
  useEffect(() => {
    if (activeSuggestion >= 0 && suggestionRefs.current[activeSuggestion]) {
      suggestionRefs.current[activeSuggestion].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSuggestion]);

  // Hide suggestions on blur (using a timeout to allow click events to process)
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder="Masukkan ID Nasabah"
        className="w-full rounded-lg p-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset text-white bg-[#1D283A] placeholder-gray-400"
      />
      {loading && <div className="text-white mt-2">Loading...</div>}
      {showSuggestions && filteredCustomers.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-[#1D283A] border border-white">
          {filteredCustomers.map((customer, index) => (
            <li
              key={customer.ID}
              ref={(el) => (suggestionRefs.current[index] = el)}
              onMouseDown={() => handleSelect(customer)}
              className={`cursor-pointer px-4 py-2 text-sm text-white hover:bg-gray-700 ${
                index === activeSuggestion ? "bg-gray-700" : ""
              }`}
            >
              {customer.ID}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && query && filteredCustomers.length === 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md bg-[#1D283A] border border-white">
          <li className="px-4 py-2 text-sm text-white">No customers found</li>
        </ul>
      )}
    </div>
  );
};

CustomerInput.propTypes = {
  customerID: PropTypes.string.isRequired,
  setCustomerID: PropTypes.func.isRequired,
};

export default CustomerInput;
