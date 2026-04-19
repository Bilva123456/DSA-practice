import ProblemTable from './ProblemTable';

function DashboardView({
  todayRoadmap,
  dayIndex,
  dailyProblems,
  statusMap,
  onStatusChange,
  solvedCount,
  totalProblems,
  progressPercent,
  weeklySummary,
  streak,
  quote
}) {
  return (
    <section>
      <div className="grid two-col">
        <div className="card">
          <h2>Today&apos;s Focus</h2>
          <p>{todayRoadmap.focus}</p>
          <p className="muted">Roadmap Day: {dayIndex + 1}/90</p>
          <p className="muted">Topic: {todayRoadmap.topic}</p>
        </div>
        <div className="card">
          <h2>Streak</h2>
          <p>Current: <strong>{streak.current}</strong> day(s)</p>
          <p>Longest: <strong>{streak.longest}</strong> day(s)</p>
          <p className="quote">💡 {quote}</p>
        </div>
      </div>

      <div className="card">
        <h2>Overall Progress</h2>
        <p>{solvedCount} / {totalProblems} problems completed</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="card">
        <h2>Daily Tasks (8-10 Problems)</h2>
        <ProblemTable problems={dailyProblems} statusMap={statusMap} onStatusChange={onStatusChange} />
      </div>

      <div className="card">
        <h2>Weekly Progress Summary</h2>
        <div className="weekly-grid">
          {weeklySummary.map((day) => (
            <div key={day.date} className="mini-card">
              <p>{day.label}</p>
              <strong>{day.completed}</strong>
              <span>completed</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardView;
