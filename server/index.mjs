import readXlsxFile from 'read-excel-file/node'
import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors())


app.get('/', async (req, res) => {
  const rows = await readXlsxFile('./sample_data.xlsx');
  rows.shift();
  res.send(rows);
  
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})