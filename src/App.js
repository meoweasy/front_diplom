import './styles/main.scss';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Navbar from'./components/navbar.js'
import Home from './pages/home.js';
import AdminHome from './pages/admin.js';

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            {<Route exact path="/" element={<Home />} />}
            <Route path="/admin_home/*" element={<AdminHome />} />
        </Routes>
    </Router>
  );
}

export default App;
