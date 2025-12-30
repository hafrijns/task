import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [text, setText] = useState(() => {
    return localStorage.getItem("savedText") || "";
  });

  useEffect(() => {
    localStorage.setItem("savedText", text);
  }, [text]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>HRI Task Design Tool (MVP)</h1>

      <p>Type something below. Refresh the page — it should stay.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%" }}
      />

      <p style={{ color: "green" }}>✔ Saved locally in your browser</p>
    </div>
  )
}

export default App
