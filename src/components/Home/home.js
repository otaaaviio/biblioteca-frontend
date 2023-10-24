import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { setBooks } from "../../actions/booksActions";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import "./home.css";

const Home = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [showPopUp, setShowPopUp] = useState(false);

  const booksPerPage = 12;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToShow = filteredBooks.slice(startIndex, endIndex);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

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

    if (searchTerm === "") {
      setFilteredBooks(books);
    }
  }, [dispatch, books, searchTerm]);

  const handleSearch = () => {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBooks(filteredBooks);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredBooks(books);
    setCurrentPage(1);
  };

  return (
    <div>
      <Header />
      <div className="container-line-input">
        <div className="container-input">
          <button className="search-btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <input
            className="input-text"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Buscar"
          />
        </div>
        {searchTerm !== "" && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            Limpar Busca
          </button>
        )}
      </div>
      <div className="container-nav">
        <div className="amount-books">Livros ({filteredBooks.length})</div>
        <button className="plus-btn" onClick={togglePopUp}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
        {showPopUp && <PopUp togglePopUp={togglePopUp} />}
      </div>
      {filteredBooks.length > 0 ? (
        <div className="books-containers">
          <ul>
            {booksToShow.map((book) => (
              <li className="container-book" key={book.id}>
                <Link
                  to={`/livro/${book.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="book-title">{book.title}</div>
                  <div className="subtitle-book">{book.author}</div>
                  <Rating rating={book.rating} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-books-container">Nenhum livro encontrado.</div>
      )}
      <div className="control-page-align">
        <button
          className="btn-control"
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button
          className="btn-control"
          onClick={() =>
            setCurrentPage((prevPage) =>
              Math.min(
                prevPage + 1,
                Math.ceil(filteredBooks.length / booksPerPage)
              )
            )
          }
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
      <Footer />
    </div>
  );
};

const Rating = ({ rating }) => {
  const stars = [];

  for (let i = 0; i < rating; i++) {
    stars.push(
      <FontAwesomeIcon
        icon={faStar}
        key={i}
        style={{ color: "rgb(245, 204, 0)" }}
      />
    );
  }

  return (
    <div>
      <span className="subtitle-book">Avaliação:</span> {stars}
    </div>
  );
};

const InputPopUp = ({ id, label, value, setValue }) => {
  return (
    <div className="floating-label-input">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder=" "
      />
      <label htmlFor={id} className={value ? "has-value" : ""}>
        {label}
      </label>
    </div>
  );
};

const PopUp = ({ togglePopUp }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");

  const addBook = async () => {
    if (!author || !title || !review || !rating) {
      console.error(
        "Por favor, preencha todos os campos antes de adicionar o livro."
      );
      return;
    }

    try {
      const data = {
        author: author,
        title: title,
        review: review,
        rating: rating,
      };

      const response = await axios.post("http://localhost:8000/livros", data);

      console.log("Resposta do backend:", response.data);

      togglePopUp();
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup_inner">
        <button onClick={togglePopUp} className="close-popup">
          x
        </button>
        <h2>Adicionar Livro à Coleção</h2>
        <InputPopUp
          id="title"
          label="Título"
          value={title}
          setValue={setTitle}
        />
        <InputPopUp
          id="author"
          label="Autor"
          value={author}
          setValue={setAuthor}
        />
        <InputPopUp
          id="rating"
          label="Nota (1 a 5)"
          value={rating}
          setValue={setRating}
        />
        <div className="floating-label-input">
          <textarea
            id="review"
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder=" "
          />
          <label htmlFor="review" className="has-value">
            Resenha
          </label>
        </div>
        <div className="add-button">
          <button onClick={addBook}>Adicionar Livro</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
