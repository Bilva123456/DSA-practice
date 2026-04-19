const statuses = ['Not Started', 'In Progress', 'Completed'];

function ProblemTable({ problems, statusMap, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Platform</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <td>
                <a href={problem.link} target="_blank" rel="noreferrer">
                  {problem.title}
                </a>
              </td>
              <td>{problem.difficulty}</td>
              <td>{problem.platform}</td>
              <td>
                <select
                  value={statusMap[problem.id] || 'Not Started'}
                  onChange={(e) => onStatusChange(problem.id, e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemTable;
