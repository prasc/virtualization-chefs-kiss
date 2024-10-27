import { useState } from 'react';
import './App.css';
import { Online } from './components/Online';
import { Offline } from './components/Offline';

function App() {
  const [connection, setConnection] = useState('online');

  const handleClick = () => {
    if (connection === 'online') {
      setConnection('offline');
    } else {
      setConnection('online');
    }
  };

  return (
    <>
      <header>Coolest nba players app</header>
      <button onClick={handleClick}>Offline</button>
      <button onClick={handleClick}>Online</button>

      {connection === 'online' && <Online />}
      {connection === 'offline' && <Offline />}
    </>
  );
}

export default App;
