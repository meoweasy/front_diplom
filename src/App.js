import './styles/main.scss';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AdminHome from './pages/admin.js';
import Home from "./pages/home.js"

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="/admin_home/*" element={<AdminHome />} />
        </Routes>
    </Router>
  );
}

export default App;
