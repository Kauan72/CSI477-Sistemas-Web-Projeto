import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Video {
    id: number;
    nome: string;
    link: string;
}

interface Compromisso {
    id: number;
    nome: string;
    tipo: string;
    videoId: number;
    data: string;
}

const UpdateCompromisso = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [videoId, setVideoId] = useState<number | ''>('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compromissoData, setCompromissoData] = useState<string>('');

    // Carrega dados do compromisso e vídeos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [compromissoResponse, videosResponse] = await Promise.all([
                    api.get<Compromisso>(`/api/compromissos/${id}`),
                    api.get<Video[]>('/api/videos')
                ]);

                const compromisso = compromissoResponse.data;
                setNome(compromisso.nome);
                setTipo(compromisso.tipo);
                setVideoId(compromisso.videoId);
                setCompromissoData(compromisso.data);
                setVideos(videosResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert('Erro ao carregar dados do compromisso');
                navigate('/');
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nome || !tipo || !videoId) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsSubmitting(true);
        
        try {
            await api.put(`/api/compromissos/${id}`, {
                nome,
                tipo,
                data: compromissoData, // Usa a data original do compromisso
                videoId: videoId // Envia como number
            });
            
            alert('Compromisso atualizado com sucesso!');
            navigate(-1); // Volta para a página anterior
        } catch (error) {
            console.error('Erro ao atualizar compromisso:', error);
            alert('Erro ao atualizar compromisso');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-compromisso-container">
            <h2>Editar Compromisso</h2>
            
            <form onSubmit={handleSubmit} className="add-compromisso-form">
                <div className="form-group">
                    <label>Nome *</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tipo *</label>
                    <input
                        type="text"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Vídeo *</label>
                    <select
                        value={videoId}
                        onChange={(e) => setVideoId(Number(e.target.value))}
                        required
                    >
                        <option value="">Selecione um vídeo</option>
                        {videos.map(video => (
                            <option key={video.id} value={video.id}>
                                {video.nome} ({video.link})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="cancel-button"
                    >
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCompromisso;