import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AddTag = () => {
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!tag.trim()) {
      alert("Preencha o nome da tag");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post('/api/tags', { tag });
      alert("Tag adicionada com sucesso");
      navigate("/gerenciartags");
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
      alert("Erro ao adicionar tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-tag-container">
      <h1>Adicionar Nova Tag</h1>
      
      <form onSubmit={handleSubmit} className="add-tag-form">
        <div className="form-group">
          <div>
            <label htmlFor="tag">Nome da Tag</label>
          </div>
          <input
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
            maxLength={50}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-buttom"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Tag'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTag;