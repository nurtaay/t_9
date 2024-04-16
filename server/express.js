const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const React = require( 'react' );
const ReactDOMServer = require( 'react-dom/server' );
const { StaticRouter, matchPath } = require( 'react-router-dom' );
// создание express приложения
const app = express();
// импорт компонента App
const { App } = require( '../src/components/app/app.component' );
// импорт роутов
const routes = require( './routes' );
// обслуживание статических ресурсов
app.get( /\.(js|css|map|ico)$/, express.static( path.resolve( __dirname, '../dist' ) ) );
// в ответ на любые другие запросы отправляем 'index.html'
app.use( '*', async ( req, res ) => {
// получаем совпадающий роут
    const matchRoute = routes.find( route =&gt; matchPath( req.originalUrl, route ) );

// получаем данные совпавшего компонента
    let componentData = null;
    if( typeof matchRoute.component.fetchData === 'function' ) {
        componentData = await matchRoute.component.fetchData();
    }

// читаем файл `index.html`
    let indexHTML = fs.readFileSync( path.resolve( __dirname, '../dist/index.html' ), {
        encoding: 'utf8',
    } );

// получаем HTML строку путем преобразования компонента 'App'
    let appHTML = ReactDOMServer.renderToString(
        &lt;StaticRouter location={ req.originalUrl } context={ componentData }&gt;
        &lt;App /&gt;
        &lt;/StaticRouter&gt;
);

// заполняем элемент '#app' содержимым из 'appHTML'
    indexHTML = indexHTML.replace( '&lt;div id=&quot;app&quot;&gt;&lt;/div&gt;', `&lt;div id=&quot;app&quot;&gt;${ appHTML }&lt;/div&gt;` );

// задаём значение для глобальной переменной 'initial_state'
    indexHTML = indexHTML.replace(
        'var initial_state = null;',
        `var initial_state = ${ JSON.stringify( componentData ) };`
    );

// задаём заголовок и статус
    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( indexHTML );

} );
// запускаем сервер на порту 9000
app.listen( '9000', () => {
    console.log( 'Express server started at <http://localhost:9000>' );
} );
// server\\routes.js

const { Counter } = require( '../src/components/counter' );
const { Post } = require( '../src/components/post' );

module.exports = [
    {
        path: '/',
        exact: true,
        component: Counter,
    },
    {
        path: '/post',
        exact: true,
        component: Post,
    }
];
// src\\components\\post\\post.component.jsx

import React from 'react';
import axios from 'axios';

export class Post extends React.Component {
    constructor( props ) {
        console.log( 'Post.constructor()' );

        super();

        // component state
        if( props.staticContext ) {
            this.state = {
                isLoading: false,
                title: props.staticContext.title,
                description: props.staticContext.body,
            };
        } else if( window.initial_state ) {
            this.state = {
                isLoading: false,
                title: window.initial_state.title,
                description: window.initial_state.body,
            };
        } else {
            this.state = {
                isLoading: true,
                title: '',
                description: '',
            };
        }
    }

    // получение данных
    static fetchData() {
        console.log( 'Post.fetchData()' );

        return axios.get( '<https://jsonplaceholder.typicode.com/posts/3>' ).then( response => {
            return {
                title: response.data.title,
                body: response.data.body,
            };
        } );
    }

    // когда компонент монтируется, получаем данные
    componentDidMount() {
        if( this.state.isLoading ) {
            console.log( 'Post.componentDidMount()' );

            Post.fetchData().then( data => {
                this.setState( {
                    isLoading: false,
                    title: data.title,
                    description: data.body,
                } );
            } );
        }
    }

    render() {
        console.log( 'Post.render()' );

        return (
            <div className='ui-post'>
                <p className='ui-post__title'>Post Widget</p>

                {
                    this.state.isLoading ? 'loading...' : (
                        <div className='ui-post__body'>
                            <p className='ui-post__body__title'>{ this.state.title }</p>
                            <p className='ui-post__body__description'>{ this.state.description }</p>
                        </div>
                    )
                }
            </div>
        );
    }
}