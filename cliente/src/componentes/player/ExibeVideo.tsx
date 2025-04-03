import { useState, useEffect } from 'react';
import api from '../../services/api';


interface Video {
  id: number;
  nome: string;
  link: string;
  classificacoes: { tag: string }[];
}

interface Tag {
  id: number;
  tag: string;
}

interface Compromisso {
  id: number;
  nome: string;
  video: Video;
  data: string;
}

const ExibeVideo = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compromissosDoDia, setCompromissosDoDia] = useState<Compromisso[]>([]);
  const [compromissoAtualIndex, setCompromissoAtualIndex] = useState(0);

  // Carrega tags e verifica compromisso do dia
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Carrega todas as tags
        const tagsResponse = await api.get('/api/tags');
        setTags(tagsResponse.data);

        // Verifica se há compromisso hoje
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/compromissos?date=${today}`);
        setCompromissosDoDia(response.data);

        if (response.data.length > 0) {
          // Começa com o primeiro compromisso
          setVideo(response.data[0].video);
        }
      } catch (err) {
        setError('Erro ao carregar dados iniciais');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Atualiza o vídeo quando muda o índice do compromisso
  useEffect(() => {
    if (compromissosDoDia.length > 0 && compromissoAtualIndex < compromissosDoDia.length) {
      setVideo(compromissosDoDia[compromissoAtualIndex].video);
    }
  }, [compromissoAtualIndex, compromissosDoDia]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleRandomVideo = async () => {
    if (!selectedTag) {
      setError('Selecione uma tag primeiro');
      return;
    }
  
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/api/tags/aleatorio/${selectedTag}`);
      console.log("Dados recebidos:", response.data); // Verifique se os dados estão completos
      setVideo(response.data);
      setCompromissosDoDia([]); // Limpa compromissos para evitar conflitos
    } catch (err) {
      setError('Erro ao buscar vídeo aleatório');
      console.error("Erro completo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextCompromisso = () => {
    setCompromissoAtualIndex(prev => 
      prev >= compromissosDoDia.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevCompromisso = () => {
    setCompromissoAtualIndex(prev => 
      prev <= 0 ? compromissosDoDia.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="video-container">
      <div className="video-controls">
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecione uma tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.tag}>
              {tag.tag}
            </option>
          ))}
        </select>

        <button 
          onClick={handleRandomVideo}
          disabled={!selectedTag || loading}
        >
          Exibir Vídeo Aleatório
        </button>
      </div>

      {video ? (
        <div className="video-player">
          <h2>{video.nome}</h2>
          
          {/* Controles de navegação entre compromissos (só aparece se houver mais de um) */}
          {compromissosDoDia.length > 1 && compromissoAtualIndex >= 0 && (
            <div className="compromisso-navigation">
              <button onClick={handlePrevCompromisso}>Anterior</button>
              <span>
                Compromisso {compromissoAtualIndex + 1} de {compromissosDoDia.length}
              </span>
              <button onClick={handleNextCompromisso}>Próximo</button>
            </div>
          )}

          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${extractVideoId(video.link)}`}
              title={video.nome}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="video-info">
            {compromissoAtualIndex >= 0 ? (
              <>
                <p><strong>Compromisso:</strong> {compromissosDoDia[compromissoAtualIndex]?.nome}</p>
              </>
            ) : (
              <p><strong>Tags:</strong> {video.classificacoes?.map(t => t.tag).join(', ')}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="no-video">
          {selectedTag ? (
            <p>Nenhum vídeo selecionado. Clique no botão para exibir um vídeo aleatório.</p>
          ) : (
            <p>Nenhum compromisso hoje. Selecione uma tag para exibir um vídeo.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExibeVideo;