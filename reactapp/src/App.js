import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ScreenHome from './ScreenHome';
import ScreenMyArticles from './ScreenMyArticles';
import ScreenSource from './ScreenSource';
import ScreenArticlesBySource from './ScreenArticlesBySource';
// import { OmitProps } from 'antd/lib/transfer/renderListBody';
import articles from './reducers/articles'
import token from './reducers/token'
import choice from './reducers/choice'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
const store = createStore(combineReducers( { articles, token, choice } ))

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            < ScreenHome />
          </Route>
          <Route path="/screenmyarticles">
            <ScreenMyArticles />
          </Route>
          <Route path="/screensource">
            <ScreenSource />
          </Route>
          <Route exact path="/screenarticlesbysource/:id">
            <ScreenArticlesBySource />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
