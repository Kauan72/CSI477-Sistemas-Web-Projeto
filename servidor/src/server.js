const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const compromissoRoutes = require('./routers/compromissoRoutes');
app.use('/api/compromissos', compromissoRoutes);

const videoRoutes = require('./routers/videoRoutes');
app.use('/api/videos', videoRoutes);

const classificacaoRoutes = require('./routers/classificacaoRoutes');
app.use('/api/tags', classificacaoRoutes);

// Importar o cliente do Prisma
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});