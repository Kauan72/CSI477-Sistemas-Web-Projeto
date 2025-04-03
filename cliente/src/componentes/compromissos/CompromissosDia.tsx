import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FaTrash } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

interface Compromisso {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  video: {
    id: number;
    nome: string;
    link: string;
  };
}

const CompromissosDia = () => {
  const { date } = useParams();
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompromissos = async () => {
      setLoading(true);
      try {
        // Garante que a data está no formato YYYY-MM-DD
        const formattedDate = date?.split('T')[0]; 
        const response = await api.get(`/api/compromissos?date=${formattedDate}`);
        setCompromissos(response.data);
      } catch (error) {
        console.error("Erro ao buscar compromissos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompromissos();
  }, [date]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confirmar exclusão?")) return;
    
    try {
      await api.delete(`/api/compromissos/${id}`);
      setCompromissos(compromissos.filter(c => c.id !== id));
      alert("Compromisso excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir compromisso:", error);
      alert("Erro ao excluir compromisso");
    }
  };

  const formatarDataExibicao = (dateString: string | undefined) => {
    if (!dateString) return "Data inválida";
    
    try {
      // Corrige o fuso horário criando a data em UTC
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "Data inválida";
      
      // Ajusta para o fuso horário local sem alterar o valor absoluto
      const adjustedDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
      
      return adjustedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC' // Força uso de UTC para formatação
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="compromissos-container">
      <div className="title">
        <h1>{formatarDataExibicao(date)}</h1>
      </div>
      <div className="add-button-div">
        <Link 
            to={`/compromissos/novo/${date}`}
            className="add-button"
          >
            +Adicionar Compromisso
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Vídeo</th>
            <th className='update-or-delete'>Edit</th>
            <th className='update-or-delete'>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5}>Carregando...</td>
            </tr>
          ) : compromissos.length === 0 ? (
            <tr>
              <td colSpan={5}>Nenhum compromisso agendado para este dia</td>
            </tr>
          ) : (
            compromissos.map(compromisso => (
              <tr key={compromisso.id}>
                <td>{compromisso.tipo}</td>
                <td>{compromisso.nome}</td>
                <td>
                  <a 
                    href={compromisso.video.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {compromisso.video.nome}
                  </a>
                </td>
                <td>
                  <Link to={`/compromissos/update/${compromisso.id}`} className='update-button'><FiEdit/></Link>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(compromisso.id)}
                    className="delete-button"
                  >
                    <FaTrash/>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompromissosDia;