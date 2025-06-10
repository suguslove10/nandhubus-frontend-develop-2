import { getFilterResponse } from "@/app/services/data.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleCheckboxChange = (option: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev[title]?.includes(option);
      return {
        ...prev,
        [title]: isSelected
          ? prev[title].filter((item) => item !== option)
          : [...(prev[title] || []), option],
      };
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-xs text-gray-700 font-semibold mb-4">{title}</h3>
      {options.map((option, index) => (
        <div key={index} className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            style={{ accentColor: "#0f7bab" }}
            checked={selectedFilters[title]?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          />
          <label className="text-gray-600 text-xs">{option}</label>
        </div>
      ))}
    </div>
  );
};

interface FilterData {
  filterName: string;
  values: string[];
}

interface FilterProps {
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

const Filter: React.FC<FilterProps> = ({
  selectedFilters,
  setSelectedFilters,
}) => {
  const fetchFilterMenu = async (): Promise<FilterData[]> => {
    try {
      return (await getFilterResponse()) as FilterData[];
    } catch (error) {
      console.error("Error fetching filter menu", error);
      return [];
    }
  };

  const filterQuery = useQuery<FilterData[]>({
    queryKey: ["filter"],
    queryFn: fetchFilterMenu,
    refetchOnWindowFocus: false, 
    retry:false,
  });
  

  const filters = filterQuery.data ?? []; 
  const isLoading = filterQuery.isLoading;
  const error = filterQuery.error;

  return (
<div className="hidden lg:block sm:w-1/5 sm:min-w-[250px] md:w-[100px] md:min-w-[180px] px-6 bg-white sticky top-0 max-h-[100vh] overflow-y-auto no-scrollbar md:_custom-sidebar">
{isLoading ? (
        <>
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mt-6 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </>
      ) : error ? (
        <p>Error loading filters</p>
      ) : (
        filters.map((filter) => (
          <FilterSection
            key={filter.filterName}
            title={filter.filterName}
            options={filter.values}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        ))
      )}
    </div>
  );
};

export default Filter;
