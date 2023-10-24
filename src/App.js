import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import "./App.css";
import Home from "./components/Home/home";
import DetailsPage from "./components/Details/details";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livro/:id" element={<DetailsPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
