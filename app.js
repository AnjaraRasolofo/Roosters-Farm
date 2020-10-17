const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.use(session({ secret: '1s2sd25asd7asd5asd7f4f1f'}));

const frontRoutes = require('./routes/frontRouter');
app.use('/', frontRoutes);
const adminRoutes = require('./routes/appRouter');
app.use('/admin', adminRoutes);
const apiRoutes = require('./routes/apiRouter');
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`))