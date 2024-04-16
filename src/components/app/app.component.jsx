import React from 'react';
import { NavLink as Link, Switch, Route } from 'react-router-dom';
// импорт дочерних компонентов
import { Counter } from '../counter';
import { Post } from '../post';
// экспорт главного компонента приложения
export class App extends React.Component {
    constructor() {
        console.log( 'App.constructor()' );
        super();
    }
// рендер представления
    render() {
        console.log( 'App.render()' );

        return (
            &lt;div className='ui-app'&gt;
            {/* navigation */}
            &lt;div className='ui-app__navigation'&gt;
            &lt;Link
        className='ui-app__navigation__link'
        activeClassName='ui-app__navigation__link--active'
        to='/'
        exact={ true }
            &gt;Counter&lt;/Link&gt;

            &lt;Link
        className='ui-app__navigation__link'
        activeClassName='ui-app__navigation__link--active'
        to='/post'
        exact={ true }
            &gt;Post&lt;/Link&gt;
            &lt;/div&gt;

            &lt;Switch&gt;
            &lt;Route
        path='/'
        exact={ true }
        render={ () =&gt; &lt;Counter name='Monica Geller'/&gt; }
        /&gt;

        &lt;Route
        path='/post'
        exact={ true }
        component={ Post }
        /&gt;
        &lt;/Switch&gt;

        &lt;/div&gt;
    );
    }

}