import { useState } from "react";
import Login from "./Login";
import OperarioDashboard from "./OperarioDashboard";
//import SupervisorDashboard from "./SupervisorDashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  if (user.role === "operario") {
    return <OperarioDashboard user={user} />;
  }

  /*
  if (user.role === "supervisor") {
    return <SupervisorDashboard user={user} />;
  }*/
}

export default App;