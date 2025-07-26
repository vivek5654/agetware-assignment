const express = require('express');
const cors = require('cors');
const db = require('./database/database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.json({ message: 'Bank Lending System API is running!' });
});

app.use('/api/v1/loans', require('./routes/loans'));
app.use('/api/v1/customers', require('./routes/customers'));

app.listen(PORT, () => {
    console.log(`Bank API server running on port ${PORT}`);
});
