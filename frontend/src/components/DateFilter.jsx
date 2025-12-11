const filters = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Half-Year", value: "6months" },
    { label: "Year", value: "year" },
];

const DateFilter = ({ activeFilter, setActiveFilter }) => {
    return (
        <div className="hidden sm:flex flex-wrap gap-4">
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`relative text-sm font-medium px-1 transition-all duration-300 
            ${activeFilter === f.value
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    {f.label}

                    <span
                        className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-blue-600 
              transition-all duration-300
              ${activeFilter === f.value ? "w-full" : "w-0"}
            `}
                    />
                </button>
            ))}
        </div>
    );
};

export default DateFilter;
