import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { setBooks } from "../../actions/booksActions";
import BookSVG from "../../assets/book.svg";
import axios from "axios";
import "./home.css";

const Home = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const [inputText, setInputText] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 16;
  const totalPages = Math.ceil(books.length / booksPerPage);
  const booksToShow = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/livros");
        dispatch(setBooks(response.data));
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    };

    searchBooks();
  }, [dispatch]);

  const amountBooks = books.length;

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div>
      <div className="header">
        <div className="header-title">
          <img src={BookSVG} alt="icon book" className="icon" />
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
          {booksToShow.map((book) => (
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
      <div className="control-page-align">
        <button className="btn-control"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button className="btn-control"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Home;
