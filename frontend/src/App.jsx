import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const hitBackend = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ouch");
      const text = await response.text();
      setMessage(text);
    } catch (error) {
      console.error(error);
      setMessage("ERROR: Backend is on fire");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={hitBackend}>
        Do NOT press this button
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;