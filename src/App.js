import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { TopLevelNavigator } from './config/Router';
import NavigationService from './services/NavigationService';
import reducers from './reducers';

class App extends Component {

    render() {
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
                <TopLevelNavigator
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </Provider>
        );
    }
}

export default App;
