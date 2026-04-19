import ProblemTable from './ProblemTable';

function TopicsView({ topics, selectedTopic, setSelectedTopic, statusMap, onStatusChange }) {
  const topic = topics.find((item) => item.topic_name === selectedTopic) || topics[0];

  return (
    <section>
      <div className="card">
        <h2>Topic-Wise Dashboard</h2>
        <div className="topic-tabs">
          {topics.map((item) => (
            <button
              key={item.topic_name}
              className={selectedTopic === item.topic_name ? 'tab active' : 'tab'}
              onClick={() => setSelectedTopic(item.topic_name)}
            >
              {item.topic_name}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>{topic.topic_name} Videos</h2>
        <div className="video-grid">
          {topic.videos.map((video) => (
            <details key={video.url} className="video-card" open>
              <summary>
                <strong>{video.title}</strong>
                <span>{video.duration}</span>
              </summary>
              <iframe
                src={video.url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </details>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>{topic.topic_name} Problem List</h2>
        <ProblemTable problems={topic.problems} statusMap={statusMap} onStatusChange={onStatusChange} />
      </div>
    </section>
  );
}

export default TopicsView;
