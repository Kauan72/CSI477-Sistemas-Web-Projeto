const { response } = require('express');
const prisma = require('../database/cliente');

exports.buscarVideosPorTag = async (req, res) => {
  const { tag } = req.params;

  try {
    // Busca os vídeos associados à tag
    const videos = await prisma.classificacao.findMany({
      where: { tag },
      include: {
        videos: true, // Retorna os vídeos associados à tag
      },
    });

    if (!videos) {
      return res.status(404).json({ error: 'Nenhum vídeo encontrado com essa tag' });
    }

    res.status(200).json(videos);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao buscar vídeos por tag' });
  }
};

exports.buscarVideoAleatorioPorTag = async (req, res) => {
  const { tag } = req.params;

  try {
    // 1. Primeiro verifica se a tag existe
    const tagExistente = await prisma.classificacao.findUnique({
      where: { tag }
    });

    if (!tagExistente) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    // 2. Busca TODOS os IDs de vídeos associados à tag
    const videosComTag = await prisma.video.findMany({
      where: {
        classificacoes: {
          some: { tag }
        }
      },
      select: { id: true } // Apenas os IDs para performance
    });

    if (videosComTag.length === 0) {
      return res.status(404).json({ error: 'Nenhum vídeo encontrado com essa tag' });
    }

    // 3. Seleciona um ID aleatório
    const videoAleatorioId = videosComTag[Math.floor(Math.random() * videosComTag.length)].id;

    // 4. Busca os dados COMPLETOS do vídeo selecionado
    const videoAleatorio = await prisma.video.findUnique({
      where: { id: videoAleatorioId },
      include: {
        classificacoes: true
      }
    });

    res.status(200).json(videoAleatorio);

  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(400).json({ 
      error: 'Falha ao buscar vídeo aleatório',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getTags = async(req, res) => {
  try{
      const tags = await prisma.classificacao.findMany();
      res.status(200).json(tags);
  }catch(error){
      res.status(400).json({error: `Error: ${error}`})
  }
};

exports.createTag = async (req, res) => {
  const { tag } = req.body;

  if (!tag) {
    return res.status(400).json({ error: 'O campo tag é obrigatório' });
  }

  try {
    // Verifica se a tag já existe
    const tagExistente = await prisma.classificacao.findUnique({
      where: { tag }
    });

    if (tagExistente) {
      return res.status(400).json({ error: 'Esta tag já existe' });
    }

    // Cria a nova tag
    const novaTag = await prisma.classificacao.create({
      data: { tag }
    });

    res.status(201).json(novaTag);
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    res.status(500).json({ 
      error: 'Falha ao criar tag',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// No ClassificacaoController.js
exports.deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se a tag existe
    const tag = await prisma.classificacao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    // Remove a tag
    await prisma.classificacao.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    
    // Trata erro de constraint (tag em uso por algum vídeo)
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Esta tag está associada a vídeos e não pode ser removida'
      });
    }

    res.status(500).json({ 
      error: 'Falha ao deletar tag',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};