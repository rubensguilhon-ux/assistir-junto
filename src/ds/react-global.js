// O bundle do design system é um script clássico que lê window.React.
// Este módulo precisa ser importado antes dele.
import React from 'react';
import ReactDOM from 'react-dom';

window.React = React;
window.ReactDOM = ReactDOM;
