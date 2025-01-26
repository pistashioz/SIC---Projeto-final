import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tips from './pages/Tips'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App;
