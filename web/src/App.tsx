import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { Button } from "./components/ui/button";
import WelcomePage from "./features/welcome/page";

// Separate component for the counter page to keep the code DRY and organized.
function CounterPage({
  count,
  onIncrement,
}: {
  count: number;
  onIncrement: () => void;
}) {
  return (
    <main className="container mx-auto p-8">
      <p className="text-3xl">
        This is a simple Vite React Typescript starterpack
      </p>
      <Button onClick={onIncrement}>Inc Count: {count}</Button>
    </main>
  );
}

function App() {
  const [count, setCount] = useState(0);

  // Handler to update the counter state.
  function handleCountUpdate() {
    setCount((prev) => prev + 1);
  }

  return (
    // Router wraps the entire app to enable routing.
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/counter"
          element={<CounterPage count={count} onIncrement={handleCountUpdate} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
