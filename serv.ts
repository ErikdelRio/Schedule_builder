//const WebSocket = require('ws');
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
app.get('/agregar', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/new_subject.html'));
});


function write_file(nombre: string, texto: string) {
  fs.writeFile(nombre, texto, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function read_file(nombre) {
  return fs.readFileSync(nombre, 'utf8');
}

io.on('connection', function(socket) {
  console.log("Someone connected");
  //socket.emit("message", "hola");

  socket.on("disconnect", function(){
    console.log("Someone disconnected");
  });

  socket.on('save_file', function(data) {
    // sockets.forEach(s => s.send(msg));
    // write_file("materias.txt", msg);
    console.log("Save file order received");
    var grupos = [];
    if(fs.existsSync(data.fileName)) {

      var string_grupos = read_file(data.fileName);
      grupos = JSON.parse(string_grupos);
    }
    // grupos = grupos.concat(data.grupo);
    grupos.push(data.grupo[0]);
    // var string_grupos = JSON.stringify(msg);
    write_file(data.fileName, JSON.stringify(grupos));
    socket.emit("message", "Grupos guardados?");
  });

  socket.on('read_file', function(msg, cb){
    var res = read_file(msg);
    var grupos = JSON.parse(res);
    cb(grupos);
  });
});

http.listen(8081, function() {
  console.log('Escuchando *:8081');
});
