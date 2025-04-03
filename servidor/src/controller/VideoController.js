const { response } = require('express');
const prisma = require('../database/cliente');

exports.createVideo = async (req, res) => {
  const { nome, link, classificacoes } = req.body;

  try {
    // Salvar o link no banco de dados
    const video = await prisma.video.create({
      data: {
        nome,
        link,
        classificacoes: {
          connectOrCreate: classificacoes.map(tag => ({
            where: { tag: tag.tag },
            create: { tag: tag.tag }
          }))
        }
      },
    });
    
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao criar vídeo' });
  }
};

exports.getVideo = async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar o vídeo no banco de dados pelo ID
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
      include: {
        classificacoes: true // Carrega as tags relacionadas
      }
    });
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }
    // Retornar o vídeo (incluindo o link)
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao buscar vídeo' });
  }
};

exports.getVideos = async(req, res) => {
  try{
      const videos = await prisma.video.findMany({
        include: {
          classificacoes: true // Carrega as tags relacionadas
        }
      });
      res.status(200).json(videos);
  }catch(error){
      res.status(400).json({error: `Error: ${error}`})
  }
};

exports.adicionarTags = async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body; // tags é um array de strings

  try {
    // Verifica se o vídeo existe
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });

    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Conecta as tags ao vídeo (cria as tags se não existirem)
    const updatedVideo = await prisma.video.update({
      where: { id: parseInt(id) },
      data: {
        classificacoes: {
          connectOrCreate: tags.map((tag) => ({
            where: { tag },
            create: { tag },
          })),
        },
      },
      include: {
        classificacoes: true, // Retorna as tags associadas ao vídeo
      },
    });

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao adicionar tags' });
  }
};

exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { nome, link, classificacoes } = req.body;

  try {
    // Verifica se o vídeo existe
    const videoExistente = await prisma.video.findUnique({
      where: { id: parseInt(id) }
    });

    if (!videoExistente) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Atualiza o vídeo e suas tags
    const videoAtualizado = await prisma.video.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        link,
        classificacoes: {
          // Remove todas as tags atuais
          set: [],
          // Conecta as novas tags (cria se não existirem)
          connectOrCreate: classificacoes.map(tag => ({
            where: { tag: tag.tag },
            create: { tag: tag.tag }
          }))
        }
      },
      include: {
        classificacoes: true // Retorna as tags atualizadas
      }
    });

    res.status(200).json(videoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(400).json({ error: 'Falha ao atualizar vídeo' });
  }
};

exports.deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o vídeo existe
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) }
    });

    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Remove o vídeo (as relações com tags são deletadas automaticamente por cascade)
    await prisma.video.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send(); // Resposta sem conteúdo para sucesso
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(400).json({ 
      error: 'Falha ao deletar vídeo',
      details: error.message 
    });
  }
};