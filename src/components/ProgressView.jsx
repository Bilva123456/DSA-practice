function ProgressView({ totalProblems, solvedCount, inProgressCount, topicStats, weeklySummary }) {
  const percent = Math.round((solvedCount / totalProblems) * 100);

  return (
    <section>
      <div className="grid three-col">
        <div className="card">
          <h3>Completed</h3>
          <p className="metric">{solvedCount}</p>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <p className="metric">{inProgressCount}</p>
        </div>
        <div className="card">
          <h3>Total Progress</h3>
          <p className="metric">{percent}%</p>
        </div>
      </div>

      <div className="card">
        <h2>Progress Bar</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="card">
        <h2>Topic-wise Progress</h2>
        <div className="topic-progress-grid">
          {topicStats.map((item) => (
            <div className="mini-card" key={item.topic}>
              <h4>{item.topic}</h4>
              <p>{item.completed}/{item.total} completed</p>
              <div className="progress-bar small">
                <div className="progress-fill" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Weekly Completed Count</h2>
        <ul>
          {weeklySummary.map((day) => (
            <li key={day.date}>{day.label}: {day.completed} completed</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProgressView;
