import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Video {
    id: number;
    nome: string;
    link: string;
    classificacoes?: { id: number; tag: string }[]; // Opcional se não for usar
}

const AddCompromisso = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !tipo || !videoId) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      // Corrige o fuso horário usando UTC
      const dataUTC = new Date(`${date}T12:00:00Z`); // Note o 'Z' no final
      const dataLocal = new Date(dataUTC.getTime() - dataUTC.getTimezoneOffset() * 60000);
      
      await api.post('/api/compromissos', {
        nome,
        tipo,
        data: dataLocal.toISOString(), // Garante a data correta
        videoId: parseInt(videoId)
      });
      
      alert('Compromisso adicionado com sucesso!');
      navigate(`/compromissos/${date}`);
    } catch (error) {
      console.error('Erro ao adicionar compromisso:', error);
      alert('Erro ao adicionar compromisso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-compromisso-container">
      <h1 className='title'>Novo Compromisso para {date}</h1>
      
      <form onSubmit={handleSubmit} className="add-compromisso-form">
        <div className="form-group">
          <div className='formlabel'>
            <label >Nome </label>
          </div>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <div className='formlabel'>
          <label >Tipo </label>
          </div>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <div className='formlabel'>
          <label >Vídeo </label>
          </div>
          <select
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
          >
            <option value="" className='select'>Selecione um vídeo</option>
            {videos.map(video => (
              <option key={video.id} value={video.id}>
                {video.nome} ({video.link})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className='submit-buttom'>
            {isSubmitting ? 'Salvando...' : 'Salvar Compromisso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompromisso;