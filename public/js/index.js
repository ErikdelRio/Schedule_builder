var socket = io();

// grupo -> tabla
/*
  horario.txt
    [g1, g2, ..., gn]
*/
// por cada gi, poner una tabla
// sobreponer tablas

function cambiaColor(elem, color1, color2) {
  if (elem.classList.contains(color1)) {
    elem.classList.remove(color1);
    elem.classList.add(color2);
  } else {
    elem.classList.remove(color2);
    elem.classList.add(color1);
  }
}

function set_color_tabla(tabla, grupo, color1, color2) {
  for(var dia in grupo.horario) {
    for(var hora in grupo.horario[dia]) {
      if(grupo.horario[dia][hora]) {
        var id_casilla = "#" + dia + (hora-15);
        var casilla = document.querySelector(id_casilla);
        cambiaColor(casilla, color1, color2);
      }
    }
  }
}

function addMessage(response) {
  // document.querySelector('#messages').innerHTML += `<div>${response}</div>`;
  // response = [g1, g2, ...]
  // parse response?
  // console.log(response[0]);
  var horario = document.querySelector("#horario"); // maybe?
  var grupos = response;
  var gruposDiv = document.getElementById("grupos");
  gruposDiv.append(createGrupo(grupos[0], "grupo1", "rojo", 1));
  gruposDiv.append(createGrupo(grupos[1], "grupo2", "verde", 2));
  // for(var grupo of grupos) {
    // var tabla = createTable();
    // horario.append(tabla);
    // set_color_tabla(null, grupo, null);
  // }
}

socket.on('connect', function(data){
  document.querySelector('#send').disabled = false;
  document.querySelector('#send').addEventListener('click', function() {
      socket.emit('read_file', document.querySelector('#message').value, addMessage);
  });
});


createHorario();
