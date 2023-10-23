import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./home.css";
import BookSVG from "./book.svg";

const Home = () => {
  const [Books, setBooks] = useState([]);
  const [amountBooks, setAmountBooks] = useState(0);
  const [inputText, setInputText] = useState([]);

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/livros");
        setBooks(response.data);
        setAmountBooks(response.data.length);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    };

    searchBooks();
  }, []);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div>
      <div className="header">
        <div className="header-title">
          <img src={BookSVG} alt="icon book" className="icon"/>
          <div>Biblioteca Pessoal</div>
        </div>
        <div>
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255,255,255,0.7)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(255,255,255,0.5)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(255,255,255,0.3)"
              />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>
      <div className="container-input">
        <button className="search-btn">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <input
          className="input-text"
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Buscar"
        ></input>
      </div>
      <div className="container-nav">
        <div className="amount-books">Livros ({amountBooks})</div>
        <button className="plus-btn">
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
      <div className="books-containers">
        <ul>
          {Books.map((book) => (
            <li className="container-book" key={book.id}>
              <strong>{book.title}</strong>
              <div>
                <strong>Autor:</strong> {book.author}
              </div>
              <div>
                <strong>Avaliação:</strong> {book.rating}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
