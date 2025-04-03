import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./Tags.css"
import { FaTrash } from 'react-icons/fa';

interface Tag {
  id: number;
  tag: string;
}

const ListTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/tags');
        setTags(response.data);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleDeleteTag = async (id: number) => {
    if (!window.confirm("Confirmar exclusão da tag?")) {
      return;
    }

    try {
      await api.delete(`/api/tags/${id}`);
      setTags(tags.filter(tag => tag.id !== id));
      alert("Tag excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir tag:", error);
      alert("Erro ao excluir tag");
    }
  };

  return (
    <div className="tags-list-container">
      <div className="list-header">
        <h1 className="title">Lista de Tags</h1>
        <div className="add-button-div">
          <Link to="/gerenciartags/adicionartag" className="add-button">
            +Adicionar Tag
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Carregando tags...</p>
      ) : (
        <table className="tags-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th className="update-or-delete">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td>{tag.tag}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteTag(tag.id)}
                    className="delete-button"
                  >
                    <FaTrash/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListTags;