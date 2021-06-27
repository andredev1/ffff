import logo from './logo.svg';
import dfinityLogo from './dfinity-logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={dfinityLogo} className="dfinity-logo" alt="logo" />
        +
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This app is deployed on Dfinity through Fleek!
        </p>
        <a
          className="App-link"
          href="https://dfinity.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about Dfinity
        </a>
        <a
          className="App-link"
          href="https://fleek.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about Fleek
        </a>
      </header>
    </div>
  );
}

export default App;
