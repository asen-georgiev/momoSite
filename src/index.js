import React,{Suspense} from 'react';
import ReactDOM from 'react-dom';
import{BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from "./components/scrollToTop";


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <ScrollToTop/>
          <Suspense fallback={(<div>Site loading...</div>)}>
    <App />
          </Suspense>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
