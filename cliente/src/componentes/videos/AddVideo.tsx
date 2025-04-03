import api from "../../services/api";
import { useState, useEffect } from "react";

interface Tag {
    id: number;
    tag: string;
}

const AddVideos = () => {
    const [nome, setNome] = useState('');
    const [link, setLink] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await api.get('/api/tags'); // Rota para buscar tags
                setTags(response.data);
            } catch (error) {
                console.error("Erro ao carregar tags:", error);
            }
        };
        fetchTags();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!nome || !link) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        setIsSubmitting(true);
        
        const data = {
            nome,
            link,
            classificacoes: selectedTags.map(tag => ({ tag }))
        };

        try {
            await api.post('/api/videos', data);
            alert("Vídeo inserido com sucesso");
            setNome('');
            setLink('');
            setSelectedTags([]);
        } catch (error) {
            console.error(error);
            alert("Erro ao inserir vídeo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTagSelection = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    return (
        <div className="add-video-container">
            <h1 className="title">Adicionar vídeo</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div>
                        <label htmlFor="nome">Nome</label>
                    </div>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <div>
                        <label htmlFor="link">Link</label>
                    </div>
                    <input
                        type="url"
                        id="link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-container">
                        {tags.map(tag => (
                            <div key={tag.id} className="tag-item">
                                <input
                                    type="checkbox"
                                    id={`tag-${tag.id}`}
                                    checked={selectedTags.includes(tag.tag)}
                                    onChange={() => handleTagSelection(tag.tag)}
                                />
                                <label htmlFor={`tag-${tag.id}`}>{tag.tag}</label>
                            </div>
                        ))}
                    </div>
                    {selectedTags.length > 0 && (
                        <small>Selecionadas: {selectedTags.join(', ')}</small>
                    )}
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-buttom">
                    {isSubmitting ? 'Enviando...' : 'Adicionar'}
                </button>
            </form>
        </div>
    );
};

export default AddVideos;