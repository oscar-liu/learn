import React from 'react';
import ReactDOM from 'react-dom';

import "./style/app.less";
import "./style/style.css";
import logo from './assets/mysql.png';

class Header extends React.Component{

    render() {
        return <div class="header">
            <div class="logo"><img width="300" src={ logo } /></div> Mysql Logo
        </div>
    }
}

ReactDOM.render(
    <Header />,
    document.getElementById('root')
)

const app = function() {
    console.log('this is app')
}

app()