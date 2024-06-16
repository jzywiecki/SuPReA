const express = require('express');
const { parse } = require('plantuml-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/parse', (req, res) => {
    const { plantUMLCode } = req.body;

    try {
        console.log(req.body);
        const data = `
@startuml
  class A
  class B
  A --|> B
@enduml
`;

        const result = parse(data);
        console.log(result)
        // const parsedDiagram = parse(plantUMLCode);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
