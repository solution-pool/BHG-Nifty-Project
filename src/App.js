import './App.css';
import Header from './components/Header';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <h1>Bookkeeper</h1>
      <nav 
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/project">Project</Link>
        <Link to="/proposal">Proposal</Link>
        <Link to="/outside">Outside</Link>
      </nav>
    </div>
  );
}

export default App;
