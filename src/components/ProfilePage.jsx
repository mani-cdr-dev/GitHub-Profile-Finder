// components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import "./ProfilePage.css";

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export default function ProfilePage({ username, onBack }) {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("User not found");
        const user = await userRes.json();

        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&per_page=10`,
        );
        const repoData = await reposRes.json();

        setUserData(user);
        setRepos(repoData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  function toggleRepo(id) {
    setExpanded(expanded === id ? null : id);
  }

  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n;
  }

  if (loading)
    return (
      <div className="container">
        <p style={{ color: "#768390", fontFamily: "Space Mono" }}>
          fetching {username}...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="container">
        <p style={{ color: "#f85149", fontFamily: "Space Mono" }}>
          error: {error}
        </p>
        <button className="back-btn" onClick={onBack}>
          ← back
        </button>
      </div>
    );

  return (
    <div className="container">
      <div className="profile-wrap">
        <button className="back-btn" onClick={onBack}>
          ← back to search
        </button>

        <div className="profile-top">
          <img
            className="avatar"
            src={userData.avatar_url}
            alt={userData.login}
          />
          <div className="profile-right">
            <div className="name-row">
              <h2>{userData.name || userData.login}</h2>
            </div>
            <div className="handle">@{userData.login}</div>
            {userData.bio && <div className="bio">{userData.bio}</div>}
            <div className="meta">
              {userData.location && (
                <span className="meta-item">📍 {userData.location}</span>
              )}
              {userData.company && (
                <span className="meta-item">🏢 {userData.company}</span>
              )}
              {userData.twitter_username && (
                <span className="meta-item">
                  🐦{" "}
                  <a
                    href={`https://twitter.com/${userData.twitter_username}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{userData.twitter_username}
                  </a>
                </span>
              )}
              {userData.blog && (
                <span className="meta-item">
                  🔗{" "}
                  <a href={userData.blog} target="_blank" rel="noreferrer">
                    {userData.blog}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="stats-grid">
          <div className="stat">
            <span className="num">{formatCount(userData.public_repos)}</span>
            <span className="lbl">repos</span>
          </div>
          <div className="stat">
            <span className="num">{formatCount(userData.followers)}</span>
            <span className="lbl">followers</span>
          </div>
          <div className="stat">
            <span className="num">{formatCount(userData.following)}</span>
            <span className="lbl">following</span>
          </div>
          <div className="stat">
            <span className="num">{formatCount(userData.public_gists)}</span>
            <span className="lbl">gists</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">repositories</span>
          <span className="repo-count">{repos.length}</span>
        </div>

        <div className="repo-list">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className={`repo-item ${expanded === repo.id ? "expanded" : ""}`}
            >
              <div className="repo-header" onClick={() => toggleRepo(repo.id)}>
                <div className="repo-left">
                  <span className="repo-name">{repo.name}</span>
                  {repo.language && (
                    <React.Fragment>
                      <div
                        className="lang-dot"
                        style={{
                          background: langColors[repo.language] || "#768390",
                        }}
                      />
                      <span className="lang-text">{repo.language}</span>
                    </React.Fragment>
                  )}
                </div>
                <div className="repo-right">
                  <span className="repo-stat">
                    ★ {formatCount(repo.stargazers_count)}
                  </span>
                  <span className="repo-stat">
                    ⑂ {formatCount(repo.forks_count)}
                  </span>
                  <span
                    className="chevron"
                    style={{
                      transform: expanded === repo.id ? "rotate(180deg)" : "",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {expanded === repo.id && (
                <div className="repo-body open">
                  <div className="repo-desc">
                    {repo.description || "no description provided."}
                  </div>
                  <div className="repo-footer">
                    <a
                      className="open-btn"
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ↗ open on github
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
