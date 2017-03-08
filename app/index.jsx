import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App apiBaseUrl="http://scrodde-mbp.local:8000/api" affiliate="7508" />, document.getElementById('container'));
});
