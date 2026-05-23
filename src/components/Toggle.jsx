const [dark, setDark] = useState(false);

return (
  <div style={{
    background: dark ? "#111" : "#fff",
    color: dark ? "#fff" : "#000",
    minHeight: "100vh"
  }}>
    <button onClick={() => setDark(!dark)}>
      Toggle Dark Mode
    </button>
  </div>
);