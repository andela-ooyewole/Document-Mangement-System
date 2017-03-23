import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Document Management System');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));
// Application listening on port 3000!
