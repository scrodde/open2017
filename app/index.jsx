import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App title={window.config.title} apiBaseUrl={window.config.apiBaseUrl} affiliate={window.config.affiliate} />, document.getElementById('container'));
});
