const express = require('express');
const app = express()
app.use(express.json());

const PORT = process.env.PORT || 3000;

const compromissoRoutes = require('./routers/compromissoRoutes');
app.use('/api', compromissoRoutes);

// Importar o cliente do Prisma
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});