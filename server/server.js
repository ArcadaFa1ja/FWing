const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173', // Match the Vue app's URL
  credentials: true,
}));
app.use(bodyParser.json());
//communication test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/testDatabase', async (req, res) => {
  try {
    const result = await prisma.sample.findMany(); 
    res.json({ result });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/createSample', async (req, res) => {
  try {
    const newSample = await prisma.sample.create({
      data: {
        title: 'ted Doe',
      },
    });

    res.json({ message: 'New sample created!', newSample });
  } catch (error) {
    console.error('Error creating sample:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// byt ut your_table, column1, och column2 till faktiska tabeller och kolumner
app.get('/api/getData', async (req, res) => {
  const data = await prisma.your_table.findMany();
  res.json(data);
  console.log("GET data")
});

app.post('/api/addData', async (req, res) => {
  const { newData } = req.body;
  await prisma.your_table.create({
    data: {
      column1: newData.field1,
      column2: newData.field2,
    },
  });
  res.send('Data added successfully');
});



//Organisationer för kide fetch
let orgs = {
  TLK:
  {
    kideUrl: "https://api.kide.app/api/companies/8216a1bc-760d-407b-9c77-5e26a041a25c",
    kideData: {}
  },

  HanSe:
  {
    kideUrl: "https://api.kide.app/api/companies/90d58532-87be-4a30-b4e3-6053db20caa5",
    kideData: {}
  },

  Commedia:
  {
    kideUrl: "https://api.kide.app/api/companies/b7b04c01-6c49-4c74-81da-9f4147aca6db",
    kideData: {}
  },

  Kult:
  {
    kideUrl: "https://api.kide.app/api/companies/d12f83ed-8efa-40d9-8288-e62f1ac8fc43",
    kideData: {}
  }
}

const fetchKide = async () => {
  console.log("fetchKide()");

  try {
    for (const org in orgs) {
      fetch(orgs[org].kideUrl)
        .then(res => res.json())
        .then(data => {
          orgs[org].kideData = data;
        })
    }
  }

  catch (error) {
    console.log("Could not fetch kide," + error);
  }
};

//Run on startup och refresh varje timme
fetchKide();
setInterval(fetchKide, 1000*60*60);


//Fetch all current kide data
app.get('/api/getKide', async (req, res) => {
  const data = orgs;

  res.send(data);
});


//Fetch specific kide data by name OBS case sensitive
app.get('/api/getKide/:name', async (req, res) => {
  const name = req.params.name;

  const data = orgs[name];

  res.send(data);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
