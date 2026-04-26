import { useEffect, useState } from "react";
import "./App.css";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1k9lBojGH3e3abZWj1hg-Vw7g2iD6RcSsqrNlR1QL2Rk/gviz/tq?tqx=out:csv&gid=349146199";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();

        const rows = parseCSV(text);

        const headers = rows[0] || [];

        const body = rows.slice(1).map((row) => {
          let obj = {};
          headers.forEach((h, i) => {
            obj[h] = row[i] || "";
          });
          return obj;
        });

        setData(body);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ safer CSV parser
  const parseCSV = (text) => {
    return text
      .trim()
      .split("\n")
      .map((row) => row.split(",").map((cell) => cell.replace(/"/g, "").trim()));
  };

  const getColor = (category) => {
    switch (category) {
      case "Attendance":
        return "#3b82f6";
      case "Aptitude":
        return "#a855f7";
      case "Coding":
        return "#f97316";
      case "GD":
        return "#ec4899";
      case "HR Evaluation":
        return "#ef4444";
      case "GD Data":
        return "#14b8a6";
      default:
        return "#64748b";
    }
  };

  // ✅ faster + safer filter
  const filtered = search
    ? data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>📊 Form Control Center</h1>
        <p>Manage all evaluation forms in one place</p>

        <input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid">
        {filtered.map((item, i) => (
          <div className="card" key={i}>
            <div className="title">{item["Form Name"]}</div>

            <div
              className="badge"
              style={{ background: getColor(item["Category"]) }}
            >
              {item["Category"]}
            </div>

            <p className="desc">{item["Purpose"]}</p>

            <div className="status">
              Status: <span>{item["Status"]}</span>
            </div>

            <a
              href={item["Form Link"]}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Open Form →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;