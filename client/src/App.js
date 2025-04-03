import React, { useState, useEffect } from 'react';
import { fetchData } from './services/api';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData();
        setMessage(data.message);
      } catch (error) {
        setMessage('Error connecting to API');
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Application</h1>  {/* Change to your app name */}
        {loading ? <p>Loading...</p> : <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
