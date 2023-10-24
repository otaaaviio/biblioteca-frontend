import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";

const BookDetails = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/livros/${id}`);
        setLivro(response.data.livro);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Header />
      <h2>{livro.title}</h2>
      <p>Autor: {livro.author}</p>
      <p>Avaliação: {livro.rating}</p>
      <p>Review: {livro.review}</p>
      <Footer />
    </div>
  );
};

export default BookDetails;
