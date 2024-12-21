import React from 'react';
import { HashRouter } from 'react-router-dom'; // Sử dụng HashRouter
import AppRouter from './routes';
import Sidebar from './components/sidebar';
//import './styles/App.css';

const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <div className="app-container">
          {/* <Sidebar />  */}
          {/* Sidebar luôn hiển thị bên trái */}
          <div className="content">
            <AppRouter /> {/* Các trang sẽ hiển thị trong khu vực này */}
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default App;
