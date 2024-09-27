/********************************************************************************* 

* ITE5315 – Assignment 1 

* I declare that this assignment is my own work in accordance with Humber Academic Policy. 

* No part of this assignment has been copied manually or electronically from any other source 

* (including web sites) or distributed to other students. 

* Name: Chak Pu Patrick Tong Student ID: N01631495 Date: 24/9/2024 * 

********************************************************************************/ 
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5500;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/data/search/isbn/", (req, res) => {
  res.sendFile(path.join(__dirname, "searchPage.html"));
});

app.get("/data/search/isbn/code/:ISBNnumber", (req, res) => {
  fs.readFile(path.join(__dirname, "mydata.json"), (err, data) => {
    if (err) {
      return res.status(500).send(`Error: ${err}`);
    }
    try {
      const jsonData = JSON.parse(data);
      const code = req.params.ISBNnumber;
      const result = jsonData.find((item) => item.isbn === code.toString());
      if (result) {
        res.json(result);
      } else {
        res.status(404).send("Book not found");
      }
    } catch (error) {
      res.status(500).send(`Error parsing JSON data: ${error}`);
    }
  });
});

app.get("/data/search/title/:title", (req, res) => {
  fs.readFile(path.join(__dirname, "mydata.json"), (err, data) => {
    if (err) {
      return res.status(500).send(`Error: ${err}`);
    }
    try {
      const jsonData = JSON.parse(data);
      const search_title = req.params.title;
      const result = jsonData.filter((item) => item.title.includes(search_title.toString()));
      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).send("Book not found");
      }
    } catch (error) {
      res.status(500).send(`Error parsing JSON data: ${error}`);
    }
  });
});

app.get("/data/", (req, res) => {
  fs.readFile(path.join(__dirname, "mydata.json"), (err, data) => {
    if (err) throw res.status(500).send(`Error: ${err}`);
    res.send(`JSON data is loaded and ready! \n ${data}`);
  });
});

app.get("/data/isbn/:index_no", (req, res) => {
  function readJSON(isbn, callback) {
    fs.readFile(path.join(__dirname, "mydata.json"), (err, data) => {
      if (err) return res.status(500).send(`Error: ${err}`);
      try {
        const jsonData = JSON.parse(data);
        const result = jsonData.find((item) => item.isbn === isbn);
        callback(result);
      } catch (error) {
        res.status(500).send(`Error parsing JSON data: ${error}`);
      }
    });
  }
  var index = req.params.index_no;
  switch(index){
    case '1': 
      readJSON('1933988673', (result) => {
        if (result) {
          res.send(result);
        } else {
          res.status(404).send('Book Not Found');
        }
      });
      break;
    case '2': 
      readJSON('1935182722', (result) => {
        if (result) {
          res.send(result);
        } else {
          res.status(404).send('Book Not Found');
        }
      });
      break;
    default: 
      res.status(400).send('Index Not Found');
  }
});



//Error Handling
app.use((req, res) => {
  res.status(400).send("Error404, Route not found");
});
//listener
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
