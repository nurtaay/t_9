import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// импорт компонента App
import { App } from './components/app/app.component';

// обработка компонента App и помещение результата в HTML элемент '#app'
ReactDOM.render( <BrowserRouter><App/></BrowserRouter>, document.getElementById( 'app' ) );