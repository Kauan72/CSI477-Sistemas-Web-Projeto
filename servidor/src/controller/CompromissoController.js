const { response } = require('express');
const prisma = require('../database/cliente')

exports.createCompromisso = async (req, res) => {
    const { nome, data, tipo, videoId } = req.body;
    
    try {
        const video = await prisma.video.findUnique({
            where: { id: parseInt(videoId) }
        });
        
        if (!video) {
            return res.status(404).json({ error: 'Vídeo não encontrado' });
        }

        const compromisso = await prisma.compromisso.create({
            data: {
                nome,
                data: new Date(data),
                tipo,
                video: { connect: { id: parseInt(videoId) } }
            },
            include: { video: true } 
        });
        
        res.status(201).json(compromisso);
    } catch (error) {
        console.error('Erro ao criar compromisso:', error);
        res.status(400).json({ 
            error: 'Falha ao criar compromisso',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getCompromissos = async (req, res) => {
    try {
        const compromissos = await prisma.compromisso.findMany({
            include: { video: true } // Inclui os vídeos relacionados
        });
        res.status(200).json(compromissos);
    } catch (error) {
        console.error('Erro ao buscar compromissos:', error);
        res.status(500).json({ 
            error: 'Falha ao buscar compromissos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getCompromissosById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const compromisso = await prisma.compromisso.findUnique({
            where: { id: parseInt(id) },
            include: { video: true }
        });
        
        if (!compromisso) {
            return res.status(404).json({ error: 'Compromisso não encontrado' });
        }
        
        res.status(200).json(compromisso);
    } catch (error) {
        console.error('Erro ao buscar compromisso:', error);
        res.status(400).json({ 
            error: 'Falha ao buscar compromisso',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
    
exports.updateCompromisso = async (req, res) => {
    const { nome, data, tipo, videoId } = req.body;
    const { id } = req.params;
    
    try {
        // Verifica se o novo vídeo existe (se videoId foi fornecido)
        if (videoId) {
            const video = await prisma.video.findUnique({
                where: { id: parseInt(videoId) }
            });
            if (!video) {
                return res.status(404).json({ error: 'Vídeo não encontrado' });
            }
        }

        const compromisso = await prisma.compromisso.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                data: new Date(data),
                tipo,
                ...(videoId && { video: { connect: { id: parseInt(videoId) } } }) // Vírgula adicionada aqui
            },
            include: { video: true }
        });
        
        res.status(200).json(compromisso);
    } catch (error) {
        console.error('Erro ao atualizar compromisso:', error);
        res.status(400).json({ 
            error: 'Falha ao atualizar compromisso',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.deleteCompromisso = async (req, res) => {
    const { id } = req.params; // Corrigido: estava usando req.params diretamente
    
    try {
        // Verifica se existe antes de deletar
        const compromisso = await prisma.compromisso.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!compromisso) {
            return res.status(404).json({ error: 'Compromisso não encontrado' });
        }

        await prisma.compromisso.delete({
            where: { id: parseInt(id) }
        });
        
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar compromisso:', error);
        res.status(400).json({ 
            error: 'Falha ao deletar compromisso',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getCompromissosByDate = async (req, res) => {
    const { date } = req.query;
  
    try {
      // Calcula o início e fim do dia específico
      const startDate = new Date(`${date}T00:00:00`);
      const endDate = new Date(`${date}T23:59:59`);
      
      const compromissos = await prisma.compromisso.findMany({
        where: {
          data: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          video: true
        },
        orderBy: {
          data: 'asc' // Ordena por horário
        }
      });
  
      res.json(compromissos);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro ao buscar compromissos',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };