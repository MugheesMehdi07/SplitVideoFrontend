import logo from './logo.svg';
import './App.css';
import Dash from './components/dashbord';
import Downloader from './components/downloader';
import { Buffer } from "buffer/";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

window.Buffer = Buffer;

function App() {
  return (
    <Router>
    <Routes>
          <Route path="" element={<Dash />} />
          <Route path="/downloader" element={<Downloader />} />
          {/* <Route exact path="/" element={<Welcome />} /> */}
    </Routes>
    </Router>      
  );
}

export default App;
