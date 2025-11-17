import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AssetList from './components/AssetList';
import EtfList from './components/EtfList';
import InvestmentHistory from './components/InvestmentHistory';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Investment Tracker</h1>
                <Switch>
                    <Route path="/assets" component={AssetList} />
                    <Route path="/etfs" component={EtfList} />
                    <Route path="/history" component={InvestmentHistory} />
                    <Route path="/" exact>
                        <h2>Welcome to the Investment Tracker</h2>
                        <p>Select a section from the menu.</p>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;