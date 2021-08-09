var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
const fs = require('fs');

var g = require('./model/Grupo')

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname,"/model")));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/modify', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/new_subject.html'));
});


io.on('connection', function(socket) {
  socket.on('save_file', function(data, cb) {
    console.log("Save file order received");

    var horario = data.horario;
    try {
      fs.writeFileSync(data.fileName, JSON.stringify(horario));
      // fs.writeFileSync(data.fileName, horario);
      cb({ error: null });
    } catch(e) {
      cb( {error: "No se pudo guardar el archivo"} );
    }
  });

  socket.on('read_file', function(data, cb){
    if(!fs.existsSync(data.fileName)) {
      cb({
        error: "No existe el archivo",
        data: null
      });
    }
    var res = fs.readFileSync(data.fileName, 'utf8');
    var grupos = JSON.parse(res);
    cb({ error: null, data: grupos });
  });
});

http.listen(8081, function() {
  console.log('Escuchando *:8081');
});
