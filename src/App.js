import './App.scss';
import Header from './components/Header';
import Home from './pages/Home';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
