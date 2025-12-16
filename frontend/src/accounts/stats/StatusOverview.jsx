const StatusOverview = () => {
  const actions = [
    { label: "Immediate Action", value: 3, color: "red" },
    { label: "Attention Needed", value: 7, color: "orange" },
    { label: "Healthy Accounts", value: 38, color: "green" },
    { label: "Avg Invoice Aging (Days)", value: 6 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((item, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl bg-white border shadow-sm`}
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p
            className={`text-2xl font-bold ${
              item.color === "red"
                ? "text-red-600"
                : item.color === "orange"
                ? "text-orange-500"
                : item.color === "green"
                ? "text-green-600"
                : "text-gray-900"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default  StatusOverview;