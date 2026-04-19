import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TopicsView from './components/TopicsView';
import ProgressView from './components/ProgressView';
import RevisionView from './components/RevisionView';
import { allProblems, motivationalQuotes, roadmap90, topicsData } from './data/dsaData';

const STATUS_KEY = 'dsa_status_map';
const LOG_KEY = 'dsa_activity_log';
const START_KEY = 'dsa_roadmap_start_date';
const USAGE_KEY = 'dsa_usage_days';
const DARK_KEY = 'dsa_dark_mode';

const todayISO = () => new Date().toISOString().slice(0, 10);

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedTopic, setSelectedTopic] = useState('Arrays');
  const [statusMap, setStatusMap] = useState(() => readStorage(STATUS_KEY, {}));
  const [activityLog, setActivityLog] = useState(() => readStorage(LOG_KEY, []));
  const [usageDays, setUsageDays] = useState(() => readStorage(USAGE_KEY, []));
  const [darkMode, setDarkMode] = useState(() => readStorage(DARK_KEY, false));

  useEffect(() => {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statusMap));
  }, [statusMap]);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usageDays));
  }, [usageDays]);

  useEffect(() => {
    localStorage.setItem(DARK_KEY, JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    const today = todayISO();
    if (!localStorage.getItem(START_KEY)) {
      localStorage.setItem(START_KEY, JSON.stringify(today));
    }
    setUsageDays((prev) => (prev.includes(today) ? prev : [...prev, today]));
  }, []);

  const startDate = readStorage(START_KEY, todayISO());
  const dayDiff = Math.floor((new Date(todayISO()) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const dayIndex = Math.min(Math.max(dayDiff, 0), 89);

  const todayRoadmap = roadmap90[dayIndex];
  const todaysTopicData = topicsData.find((topic) => topic.topic_name === todayRoadmap.topic) || topicsData[0];
  const dailyProblemCount = 8 + (dayIndex % 3);
  const dailyOffset = dayIndex % todaysTopicData.problems.length;
  const dailyProblems = Array.from({ length: dailyProblemCount }, (_, idx) => {
    return todaysTopicData.problems[(dailyOffset + idx) % todaysTopicData.problems.length];
  });

  const onStatusChange = (problemId, status) => {
    setStatusMap((prev) => ({ ...prev, [problemId]: status }));
    setActivityLog((prev) => [
      ...prev,
      { date: todayISO(), problemId, status, timestamp: new Date().toISOString() }
    ]);
  };

  const solvedCount = allProblems.filter((problem) => statusMap[problem.id] === 'Completed').length;
  const inProgressCount = allProblems.filter((problem) => statusMap[problem.id] === 'In Progress').length;
  const totalProblems = allProblems.length;
  const progressPercent = Math.round((solvedCount / totalProblems) * 100);

  const weeklySummary = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - idx));
      const iso = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      const completed = activityLog.filter((entry) => entry.date === iso && entry.status === 'Completed').length;
      return { date: iso, label, completed };
    });
    return days;
  }, [activityLog]);

  const topicStats = topicsData.map((topic) => {
    const completed = topic.problems.filter((problem) => statusMap[problem.id] === 'Completed').length;
    const total = topic.problems.length;
    return {
      topic: topic.topic_name,
      completed,
      total,
      percent: Math.round((completed / total) * 100)
    };
  });

  const completedWithDate = allProblems
    .filter((problem) => statusMap[problem.id] === 'Completed')
    .map((problem) => {
      const logs = activityLog.filter((entry) => entry.problemId === problem.id && entry.status === 'Completed');
      const lastDate = logs.length ? logs[logs.length - 1].date : todayISO();
      return { ...problem, lastDate };
    });

  const reviseToday = completedWithDate.filter((problem) => {
    const daysAgo = Math.floor((new Date(todayISO()) - new Date(problem.lastDate)) / (1000 * 60 * 60 * 24));
    return daysAgo >= 3;
  });

  const reviseWeek = completedWithDate.filter((problem) => {
    const daysAgo = Math.floor((new Date(todayISO()) - new Date(problem.lastDate)) / (1000 * 60 * 60 * 24));
    return daysAgo >= 7;
  });

  const streak = useMemo(() => {
    const sorted = [...usageDays].sort();
    if (sorted.length === 0) return { current: 0, longest: 0 };

    let longest = 1;
    let currentRun = 1;

    for (let i = 1; i < sorted.length; i += 1) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        currentRun += 1;
      } else if (diff > 1) {
        currentRun = 1;
      }
      longest = Math.max(longest, currentRun);
    }

    let current = 1;
    for (let i = sorted.length - 1; i > 0; i -= 1) {
      const curr = new Date(sorted[i]);
      const prev = new Date(sorted[i - 1]);
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        current += 1;
      } else {
        break;
      }
    }

    return { current, longest };
  }, [usageDays]);

  const quote = motivationalQuotes[dayIndex % motivationalQuotes.length];

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((prev) => !prev)}
      />
      <main className="main-content">
        {activeView === 'Dashboard' && (
          <DashboardView
            todayRoadmap={todayRoadmap}
            dayIndex={dayIndex}
            dailyProblems={dailyProblems}
            statusMap={statusMap}
            onStatusChange={onStatusChange}
            solvedCount={solvedCount}
            totalProblems={totalProblems}
            progressPercent={progressPercent}
            weeklySummary={weeklySummary}
            streak={streak}
            quote={quote}
          />
        )}

        {activeView === 'Topics' && (
          <TopicsView
            topics={topicsData}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            statusMap={statusMap}
            onStatusChange={onStatusChange}
          />
        )}

        {activeView === 'Progress' && (
          <ProgressView
            totalProblems={totalProblems}
            solvedCount={solvedCount}
            inProgressCount={inProgressCount}
            topicStats={topicStats}
            weeklySummary={weeklySummary}
          />
        )}

        {activeView === 'Revision' && <RevisionView reviseToday={reviseToday} reviseWeek={reviseWeek} />}
      </main>
    </div>
  );
}

export default App;
