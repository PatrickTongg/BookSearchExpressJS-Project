// Import necessary modules and initialize express app
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5500;

// Serve the main HTML file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the search page for ISBN on the specified route
app.get("/data/search/isbn/", (req, res) => {
  res.sendFile(path.join(__dirname, "searchPage.html"));
});

// Handle search by ISBN number and return relevant book data
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

// Handle search by title and return relevant book data
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

// Load and respond with all JSON data
app.get("/data/", (req, res) => {
  fs.readFile(path.join(__dirname, "mydata.json"), (err, data) => {
    if (err) throw res.status(500).send(`Error: ${err}`);
    res.send(`JSON data is loaded and ready! \n ${data}`);
  });
});

// Handle retrieval of book data by specific index
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

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});