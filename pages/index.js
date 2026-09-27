import { useEffect, useState, useCallback } from "react";

const STATUS = {
  playing: { label: "Playing", color: "#3ddc84" },
  studio: { label: "In Studio", color: "#ff9a3d" },
  online: { label: "Online", color: "#6b6d75" },
  offline: { label: "Offline", color: "#6b6d75" },
  unknown: { label: "Unknown", color: "#6b6d75" },
};

const POLL_MS = 15000; // stay well under Roblox's rate limits
const PROFILE_URL = "https://www.roblox.com/users/423428585/profile";

export default function Home() {
  const [data, setData] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      const json = await res.json();
      setData(json);
      setLastChecked(new Date());
    } catch (e) {
      // keep showing the last known state rather than blanking the page
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  const s = STATUS[data?.status] || STATUS.unknown;
  const name = data?.username || "HARRY2O6";

  return (
    <div className="wrap">
      <div className="section-head">
        <span className="title">Development Team</span>
        <span className="count">1</span>
      </div>

      
        className="card"
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ "--status-color": s.color, "--status-glow": `${s.color}55` }}
      >
        <div className="avatar-wrap">
          {data?.avatarUrl ? (
            <img className="avatar-img" src={data.avatarUrl} alt={name} />
          ) : (
            <div className="avatar">{name.slice(0, 2).toUpperCase()}</div>
          )}
          <span className="status-dot" />
        </div>
        <div className="who">
          <div className="name">{name}</div>
          <div className="role">
            {s.label}
            {data?.status === "playing" && data?.lastLocation
              ? ` — ${data.lastLocation}`
              : ""}
          </div>
        </div>
      </a>

      <div className="hint">
        {lastChecked
          ? `Live from Roblox · last checked ${lastChecked.toLocaleTimeString()}`
          : "Connecting to Roblox…"}
        {data?.error ? ` · ${data.error}` : ""}
      </div>

      <style jsx global>{`
        :root {
          --bg: #0d0e11;
          --panel: #16171b;
          --panel-hover: #1c1e23;
          --border: #26282e;
          --text: #f0f1f3;
          --text-dim: #8b8d94;
          --accent: #5b8dff;
          --font: "Inter", system-ui, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          min-height: 100vh;
        }
      `}</style>

      <style jsx>{`
        .wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px clamp(16px, 4vw, 32px);
        }
        .section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
          margin-bottom: 18px;
        }
        .title {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-dim);
        }
        .count {
          font-size: 13px;
          color: var(--text-dim);
        }
        .card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          max-width: 300px;
          transition: background 0.15s ease, transform 0.15s ease,
            box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--status-color, var(--border));
        }
        .card:hover {
          background: var(--panel-hover);
          transform: translateY(-2px);
          border-color: var(--status-color, var(--border));
          box-shadow: 0 12px 28px -10px var(--status-glow, rgba(0, 0, 0, 0.4));
        }
        .avatar-wrap {
          position: relative;
          flex: none;
        }
        .avatar,
        .avatar-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #0b0d14;
          background: var(--accent);
        }
        .avatar-img {
          object-fit: cover;
          display: block;
        }
        .status-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid var(--panel);
          background: var(--status-color, #6b6d75);
        }
        .who {
          min-width: 0;
        }
        .name {
          font-weight: 700;
          font-size: 15px;
        }
        .role {
          color: var(--status-color, var(--text-dim));
          font-size: 13px;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hint {
          color: var(--text-dim);
          font-size: 12px;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
