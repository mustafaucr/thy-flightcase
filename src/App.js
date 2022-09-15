import { Route, Routes } from "react-router-dom"
import Main from "./Main";
import Flight from "./Flight";
import Result from "./Result"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/resultFlight" element={<Result />} />
        <Route path="/selectFlight" element={<Flight />} />
        <Route exact path='/' element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
