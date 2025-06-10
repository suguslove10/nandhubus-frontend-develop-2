import { getFilterResponse } from "@/app/services/data.service";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

interface FilterComponentProps {
  setIsMobileFilterOpen: (value: boolean) => void;
  selectedFilter: Record<string, string[]>;
  setSelectedFilter: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

interface FilterData {
  filterName: string;
  values: string[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  setIsMobileFilterOpen,
  selectedFilter,
  setSelectedFilter,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>(selectedFilter); // Initialize with the selectedFilter prop
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterChange = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const options = prev[category] || [];
      return {
        ...prev,
        [category]: options.includes(option)
          ? options.filter((o) => o !== option)
          : [...options, option],
      };
    });
  };

  const fetchFilterMenu = async (): Promise<FilterData[]> => {
    try {
      const response = await getFilterResponse();
      if (response) {
        return response as FilterData[];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const {
    data: filters = [],
    isLoading,
    error,
  } = useQuery<FilterData[]>({
    queryKey: ["filter"],
    queryFn: fetchFilterMenu,
    retry: false, 
    refetchOnWindowFocus: false,
  });

  // Sync selectedFilter prop with local state
  useEffect(() => {
    setSelectedFilters(selectedFilter);
  }, [selectedFilter]);

  // Set the active filter when filters are loaded
  useEffect(() => {
    if (filters.length > 0) {
      setActiveFilter(filters[0].filterName);
    }
  }, [filters]);

  if (isLoading) return <p>Loading filters...</p>;
  if (error) return <p>Error loading filters</p>;

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between font-[500] border-b p-4">
        <h2 className="text-sm font-[500]">Filters</h2>
        <button
          className="text-red-500 text-sm"
          onClick={() => {
            setSelectedFilters({});
          }}
        >
          Clear
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-1/2 border-r overflow-auto">
          {filters.map((filter) => (
            <button
              key={filter.filterName}
              className={`block w-full py-4 border border-b-gray-100 text-[10px] whitespace-nowrap text-center ${
                activeFilter === filter.filterName ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveFilter(filter.filterName)}
            >
              {filter.filterName}
              {selectedFilters[filter.filterName]?.length > 0 && (
                <span className="ml-1 text-[#0f7bab]">
                  ( {selectedFilters[filter.filterName].length} )
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Right Options Section */}
        <div className="w-2/3 p-4 overflow-auto">
          {filters.map(
            (filter) =>
              activeFilter === filter.filterName && (
                <div key={filter.filterName}>
                  {filter.values.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-xs mb-5"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters[filter.filterName]?.includes(
                            option
                          ) || false
                        }
                        onChange={() =>
                          handleFilterChange(filter.filterName, option)
                        }
                        className="w-3 h-3"
                        style={{ accentColor: "#0f7bab" }}
                      />
                      <span className="text-[10px]">{option}</span>
                    </label>
                  ))}
                </div>
              )
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-evenly border-t p-4 text-sm">
        <button
          className="text-gray-400"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          Close
        </button>
        <span>|</span>
        <button
          className={`text-[#0f7bab] ${
            Object.keys(selectedFilters).length === 0
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          onClick={() => {
            setSelectedFilter(selectedFilters);
            setIsMobileFilterOpen(false);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;