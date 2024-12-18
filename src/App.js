import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes';
import Sidebar from './components/sidebar';
import './styles/App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          <Sidebar /> {/* Sidebar luôn hiển thị bên trái */}
          <div className="content">
            <AppRouter /> {/* Các trang sẽ hiển thị trong khu vực này */}
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
