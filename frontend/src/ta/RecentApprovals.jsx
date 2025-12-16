export default function RecentApprovals() {
  const approvals = [
    { name: "Anil Kumar", department: "IT", date: "Jun 12, 2025" },
    { name: "Maria Singh", department: "HR", date: "Jun 11, 2025" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Approvals</h3>
      <table className="w-full text-sm">
        <thead className="text-gray-500 text-left">
          <tr>
            <th className="py-2">Name</th>
            <th>Department</th>
            <th>Date Approved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((person, idx) => (
            <tr key={idx} className="border-t text-gray-800">
              <td className="py-2">{person.name}</td>
              <td>{person.department}</td>
              <td>{person.date}</td>
              <td>
                <span className="text-green-600">✔</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
