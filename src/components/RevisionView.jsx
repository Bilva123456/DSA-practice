function RevisionView({ reviseToday, reviseWeek }) {
  return (
    <section>
      <div className="card">
        <h2>Revise Today</h2>
        {reviseToday.length === 0 ? (
          <p>No pending revision today. Keep solving!</p>
        ) : (
          <ul>
            {reviseToday.map((problem) => (
              <li key={problem.id}>
                <a href={problem.link} target="_blank" rel="noreferrer">{problem.title}</a> ({problem.topic})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Weekly Revision Suggestions</h2>
        {reviseWeek.length === 0 ? (
          <p>Complete more problems to get weekly suggestions.</p>
        ) : (
          <ul>
            {reviseWeek.map((problem) => (
              <li key={problem.id}>
                <a href={problem.link} target="_blank" rel="noreferrer">{problem.title}</a> - {problem.topic}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RevisionView;
