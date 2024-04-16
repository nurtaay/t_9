// импорт компонента App
import { App } from './components/app/app.component';

// обработка компонента App и вставка его в HTML элемент #app
ReactDOM.hydrate( <App/>, document.getElementById( 'app' ) );