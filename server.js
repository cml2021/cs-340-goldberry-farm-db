const express = require('express');   
const path = require('path');

const app = express();            
const PORT = 5600;                 


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));     
}); 
    
app.get('/seeds', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/seeds.html'));
});

app.get('/crops', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/crops.html'));
});

app.get('/seasons', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/seasons.html'));
});

app.get('/sales', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/sales.html'));
});

app.get('/customers', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/customers.html'));
});

app.get('/crops-seasons', function(req, res){
    res.sendFile(path.join(__dirname, '/pages/crops-seasons.html'));
});

app.listen(PORT, function(){            
    console.log(`Server started on PORT ${PORT}...`)
});