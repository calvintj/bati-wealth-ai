import { useCustomerIDList } from "@/hooks/customer-details/use-customer-id-list";
import { CustomerDetails } from "@/types/page/customer-details";
import { useEffect, useState, useRef } from "react";

interface CustomerInputProps {
  customerID: string;
  setCustomerID: (customerID: string) => void;
}

const CustomerInput = ({ customerID, setCustomerID }: CustomerInputProps) => {
  const { data: customers = [], isLoading: loading } = useCustomerIDList();

  const [query, setQuery] = useState(customerID || "");

  useEffect(() => {
    setQuery(customerID || "");
  }, [customerID]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const suggestionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredCustomers = customers.filter((cust) => {
    const id =
      cust.bp_number_wm_core && cust.bp_number_wm_core.toString().toLowerCase();
    return id && id.includes(trimmedQuery);
  });

  const handleSelect = (customer: CustomerDetails) => {
    setCustomerID(customer.bp_number_wm_core || "");
    setQuery(customer.bp_number_wm_core || "");
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        handleSelect(filteredCustomers[activeSuggestion]);
      } else if (query.trim() !== "") {
        setCustomerID(query);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

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
        className="w-full rounded-lg p-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset text-black dark:text-white bg-white dark:bg-[#1D283A] placeholder-gray-400"
      />
      {loading && <div className="text-white mt-2">Loading...</div>}
      {showSuggestions && filteredCustomers.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none">
          {filteredCustomers.map((customer, index) => (
            <li
              key={customer.bp_number_wm_core}
              ref={(el) => {
                suggestionRefs.current[index] = el;
                return undefined;
              }}
              onMouseDown={() => handleSelect(customer)}
              className="cursor-pointer px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {customer.bp_number_wm_core}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && query && filteredCustomers.length === 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-[#1D283A] border border-gray-300 dark:border-none">
          <li className="px-4 py-2 text-sm text-black dark:text-white">
            No customers found
          </li>
        </ul>
      )}
    </div>
  );
};

export default CustomerInput;
