// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"

// Importar React y ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// const container = document.getElementById('react-app');
// const root = createRoot(container);
// root.render(<App />);

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('react-app');
    if (container) {
      const root = createRoot(container);
      root.render(<App />);
    }
  });