import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import History from "./pages/History";
import Nav from "./components/Nav.js";
import Stock from "./pages/Stock";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/stock" exact component={Stock}></Route>
          <Route path="/history" component={History}></Route>
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => (
  <div>
    <h1>Stock Price</h1>
    <p>
      Welcome to Stock Market Pages. You may click on the stock to view all of
      the stocks or search {<FaChartLine />}
    </p>
  </div>
);

export default App;
