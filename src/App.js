import './styles/main.scss';
import {
    BrowserRouter as Router,
    Routes,
    //Route,
} from "react-router-dom";
import Navbar from'./components/navbar.js'

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            {/* <Route exact path="/" element={<Home />} /> */}
        </Routes>
    </Router>
  );
}

export default App;
