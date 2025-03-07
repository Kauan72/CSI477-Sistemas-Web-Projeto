const { response } = require('express');
const prisma = require('../database/cliente')

exports.createCompromisso = async (req, res) => {
    const {nome, data, tipo} = req.body;
    try{
        const compromisso = await prisma.compromisso.create({
                data: {
                    nome,
                    data: new Date(data),
                    tipo
                }
            });
            res.status(201).json(prisma.compromisso)
        }catch(error){
            res.status(400).json({error: `Error ${error}`})
        };
 
};

exports.getCompromissos = async(req, res) => {
    try{
        const compromissos = await prisma.compromisso.findMany();
        res.status(200).json(compromissos);
    }catch(error){
        res.status(400).json({error: `Error: ${error}`})
    }
};

exports.getCompromissosById = async(req, res) => {
    const {id} = req.params;
    try{
        const compromisso = await prisma.compromisso.findUnique({
            where: {id: parseInt(id)}
        });
        if(!compromisso){
            res.status(400).json({error: `Compromisso não encontrado`});
        }
        res.status(200).json(compromisso);

    }catch(error){
        res.status(400).json({error: `Error: ${error}`})
    }
};
    
exports.updateCompromisso = async(req, res) => {
    const {nome, data, tipo} = req.body;
    const {id} = req.params;
    try{
        const compromisso = await prisma.compromisso.update({
            where: {id: parseInt(id)},
            data: {
                nome,
                data: new Date(data),
                tipo
            }
        })
        res.status(200).json(compromisso);
    }catch(error){
        res.status(400).json({error: `Error: ${error}`})
    };
};

exports.deleteCompromisso = async(req, res) => {
    const id = res.params;
    try{
        const compromisso = await prisma.compromisso.delete({
            where: {id: parseInt(id)}
        });
        res.status(204).send()
    }catch(error){
        res.status(400).json({error: `Error: ${error}`});
    }
};
