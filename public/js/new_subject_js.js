function cambiaColor(event, color1, color2) {
  let target = event.target;
  if (target.classList.contains(color1)) {
    target.classList.remove(color1);
    target.classList.add(color2);
  } else {
    target.classList.remove(color2);
    target.classList.add(color1);
  }
}

function click_hora(e) {
  cambiaColor(e, "azul", "negro");
  let id = e.target.id;
  let hora = 15 + parseInt(id.substring(2));
  let dia = id.substring(0,2);
  grupo.horario[dia][hora] = !grupo.horario[dia][hora];
}

var mouseIsDown = false;
document.addEventListener("mousedown", e => {
  mouseIsDown = true;
  if(e.target.classList.contains("hora")) {
    e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();
    click_hora(e);
  }
});
document.addEventListener("mouseup", e => mouseIsDown = false);
let divsHora = document.getElementsByClassName("hora");
for (divHora of divsHora) {
  divHora.addEventListener("mouseenter", e => {
    if(mouseIsDown) {
      click_hora(e);
    }
  });
}

// let horario = document.getElementById("horario");

// ---------- Socket -----------

var socket = io(); //('http://localhost:8081'); //.connect('http://localhost:8081');
var grupo = new Grupo();
// On connection
socket.on('connect', function(data){
  document.querySelector('#send').disabled = false;
  document.querySelector('#send').addEventListener('click', function() {
    socket.emit('save_file', {
      fileName: document.querySelector('#message').value,
      grupo: [grupo]
    });
  });
});

socket.on("message", function(msg) {
  document.querySelector('#messages').innerHTML += `<div>${msg}</div>`;
});
