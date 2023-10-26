import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import "./details.css";

const BookDetails = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");

  /* initially makes a request to the backend to return all information from the specific book */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://biblioteca-backend-production.up.railway.app/livros/${id}`);
        setLivro(response.data.livro);
        console.log(response.data);
        setLoading(false);

        setTitle(livro.title);
        setAuthor(livro.author);
        setRating(livro.rating);
        setReview(livro.review);
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, livro.title, livro.author, livro.rating, livro.review]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  /* request for att book in backend */
  const attBook = async () => {
    if (!author || !title || !review || !rating) {
      console.error(
        "Por favor, preencha todos os campos antes de adicionar o livro."
      );
      return;
    }

    if (
      author === livro.author &&
      title === livro.title &&
      review === livro.review &&
      rating === livro.rating
    ) {
      setEditing(!editing);
      return;
    }

    try {
      const data = {
        title: title,
        author: author,
        review: review,
        rating: rating,
      };

      const response = await axios.put(
        `https://biblioteca-backend-production.up.railway.app/livros/${id}`,
        data
      );

      console.log("Resposta do backend:", response.data);

      setLivro((prevLivro) => ({
        ...prevLivro,
        author: data.author,
        title: data.title,
        review: data.review,
        rating: data.rating,
      }));
    } catch (error) {
      console.error("Erro ao editar livro:", error);
    }

    setEditing(!editing);
  };

  /* request for delete book in backend */
  const deleteBook = async () => {
    try {
      const response = await axios.delete(`https://biblioteca-backend-production.up.railway.app/livros/${id}`);
      console.log("Resposta do backend:", response.data);

      togglePopUp();
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
    }

    const home = "https://biblioteca-backend-production.up.railway.app";
    window.location.href = home;
  };

  const formatData = (data) => {
    const dataObj = new Date(data);
    const ano = dataObj.getFullYear();
    const mes = ("0" + (dataObj.getMonth() + 1)).slice(-2);
    const dia = ("0" + dataObj.getDate()).slice(-2);
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div className="center-container">
        <div className="container-book-content">
          <div className="edit-container">
            <h3>Título:</h3>
            <input
              value={title}
              type="text"
              readOnly={!editing}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="edit-container">
            <h3>Autor:</h3>
            <input
              value={author}
              type="text"
              readOnly={!editing}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="edit-rating">
            <h3>Nota (1 a 5):</h3>
            {editing && (
              <input
                value={rating}
                type="number"
                min={1}
                max={5}
                readOnly={!editing}
                onChange={(e) => setRating(e.target.value)}
              />
            )}
            <Stars rating={livro.rating} />
          </div>
          <div className="review-container">
            <h3>Resenha:</h3>
            <textarea
              value={review}
              readOnly={!editing}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <h3>Data de adição: {formatData(livro.created_at)}</h3>
          <div className="container-btn">
            {!editing && (
              <button onClick={() => setEditing(!editing)}>
                Alterar Dados
              </button>
            )}
            {editing && <button onClick={attBook}>Confirmar Mudanças</button>}
          </div>
        </div>
      </div>
      <div className="delete-btn">
        <button onClick={togglePopUp}>Deletar Livro</button>
        {showPopUp && (
          <PopUp togglePopUp={togglePopUp} deleteBook={deleteBook} />
        )}
      </div>
      <Footer />
    </div>
  );
};

const Stars = ({ rating }) => {
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

  return <div>{stars}</div>;
};

const PopUp = ({ togglePopUp, deleteBook }) => {
  return (
    <div className="popup-delete">
      <div className="popup_inner-delete">
        <div className="close-popup-delete">
          <button onClick={togglePopUp}>x</button>
        </div>
        <h2>Tem certeza que quer deletar o livro selecionado?</h2>
        <div className="confirm-delete">
          <button onClick={deleteBook}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
