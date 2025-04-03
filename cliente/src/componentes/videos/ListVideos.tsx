import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaTrash } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi';

interface VideoInterface {
  id: number;
  nome: string;
  link: string;
  classificacoes: { id: number; tag: string }[]; 
}

interface ApiTagResponse {
  id: number;
  tag: string;
  videos: {
    id: number;
    nome: string;
    link: string;
  }[];
}

const ListVideos = () => {
  const [allTags, setAllTags] = useState<{id: number, tag: string}[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca todas as tags disponíveis
  useEffect(() => {
    api.get('/api/tags')
      .then(response => setAllTags(response.data))
      .catch(error => console.error("Erro ao buscar tags:", error));
  }, []);

  // Busca vídeos por tag ou todos os vídeos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        if (selectedTag) {
          const response = await api.get<ApiTagResponse[]>(`/api/tags/${selectedTag}/videos`);

          const videosWithTags = response.data[0]?.videos?.map((video) => ({
            ...video,
            classificacoes: [{ id: response.data[0].id, tag: response.data[0].tag }]
          })) || [];
          setVideos(videosWithTags);
        } else {
          const response = await api.get('/api/videos');
          setVideos(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedTag]);

  const handleDeleteEstado = async (id : number) => {
    if(!window.confirm("Confirmar exclusão")){
      return;
    }

    try {
      await api.delete(`api/videos/${id}`)

      alert("Vídeo excluído com sucesso")

      setVideos ( videos.filter( video => video.id !== id) )
    } catch (error) {
      alert("Erro na exclusão")
      console.error(error)
    }
  }

  return (
    <div className="video-list-container">
      <div className="list-header">
        <h1 className="title">Lista de Vídeos</h1>
        <div className="add-button-div">
          <Link to = "/gerenciarvideos/adicionarvideos" className="add-button">
            +Add vídeo
          </Link>
        </div>
        <div className="filter">
          
          <select className="select"
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            disabled={loading}
          >
            <option value="">Todos os vídeos</option>
            {allTags.map(tag => (
              <option key={tag.id} value={tag.tag}>
                {tag.tag}
              </option>
            ))}
          </select>
          {loading && <span className="loading-indicator">Carregando...</span>}
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Link</th>
            <th>Tags</th> 
            <th className="update-or-delete">Edit</th>
            <th className="update-or-delete">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {videos.map(video => (
            <tr key={video.id}>
              <td>{video.id}</td>
              <td>{video.nome}</td>
              <td>
                <a href={video.link} target="_blank" rel="noopener noreferrer">
                  link
                </a>
              </td>
              <td>
                {video.classificacoes?.map(t => t.tag).join(', ') || 'Sem tags'}
              </td>
              <td>
                <Link to={`/gerenciarvideos/atualizarvideos/${video.id}`} className="update-button"><FiEdit/></Link>
              </td>
              <td><button onClick={ () => {handleDeleteEstado(video.id)}} className="delete-button"><FaTrash/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListVideos;