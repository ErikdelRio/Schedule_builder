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
  cambiaColor(e, "azul", "transparente");
  let id = e.target.id;
  let hora = 15 + parseInt(id.substring(2));
  let dia = id.substring(0,2);
  currGrupo.horario[dia][hora] = !currGrupo.horario[dia][hora];
}

var mouseIsDown = false;
document.addEventListener("mouseup", e => mouseIsDown = false);
document.addEventListener("mousedown", e => {
  mouseIsDown = true;
  if(e.target.classList.contains("hora")) {
    // e.cancelBubble = true;
    e.preventDefault();
    // e.stopPropagation();
    click_hora(e);
  }
});

function addHoraListeners() {
  // let divsHora = [...document.getElementsByClassName("hora")];
  var divsHora = document.querySelectorAll(".hora");
  for (var divHora of divsHora) {
    divHora.addEventListener("mouseenter", e => {
      if(mouseIsDown) {
        click_hora(e);
      }
    });
  }
}
createHorario();
var materias = {};
// var currMateria = "";
var currGrupo = null;

// ****************** agregar ********************
function intercambiaMateria(nombre) {
  var grps = materias[nombre];
  selectGrupo.innerHTML = "";
  selectMateria.value = nombre;

  for (let g in grps) {
    var newOp = document.createElement("option");
    newOp.innerText = grps[g].name;
    newOp.value = grps[g].name;
    selectGrupo.append(newOp);
  }
  var nom_grps = Object.keys(grps);
  intercambiaGrupo(nom_grps[0]);
}
function intercambiaGrupo(nombre) {
  grupos.innerHTML = "";
  if(!nombre) {
    currGrupo = null;
    return;
  }
  currGrupo = materias[selectMateria.value][nombre];
  selectGrupo.value = currGrupo.name;
  // console.log(g);
  var divGrupo = createGrupo(currGrupo, "azul");
  grupos.append(divGrupo);
  addHoraListeners();
}

read.addEventListener("click", e => {
  var nomArch = document.querySelector('#readFile').value.trim();
  socket.emit("read_file", {fileName: nomArch}, (res)=> {
    if(res.err) {
      console.error(res.err);
      return;
    };
    materias = res.data;

    grupos.innerHTML = "";
    selectMateria.innerHTML = "";
    selectGrupo.innerHTML = "";

    var materias_keys = Object.keys(materias);
    if(materias_keys.length == 0) {
      return;
    }
    for(let nomMateria of materias_keys) {
      var newOp = document.createElement("option");
      newOp.innerText = nomMateria;
      newOp.value = nomMateria;
      selectMateria.append(newOp);
    }
    intercambiaMateria(materias_keys[0]);
    // grupos.append(createGrupo(currGrupo, "azul"));
    // addHoraListeners();
  });
});
selectMateria.addEventListener("change", e => {intercambiaMateria(selectMateria.value)});
selectGrupo.addEventListener("change", e => {intercambiaGrupo(selectGrupo.value)});
addMateria.addEventListener("click", e => {
  var nombreMateria = nuevaMateria.value.trim();
  if(nombreMateria == "") {
    console.log("Nombre de materia inválido")
    return;
  }
  if(materias[nombreMateria] != null) {
    // mensaje de que ya existe esa materia
    console.log("Ya existe esa materia");
    return;
  }
  nuevaMateria.value = "";
  selectGrupo.innerHTML = "";
  grupos.innerHTML = "";

  var newOp = document.createElement("option");
  newOp.innerText = nombreMateria;
  newOp.value = nombreMateria;

  materias[nombreMateria] = {};
  selectMateria.append(newOp);
  selectMateria.value = nombreMateria;
});

addGrupo.addEventListener("click", e => {
  var nombreMateria = selectMateria.value;
  var nombreGrupo = nuevoGrupo.value.trim();
  nuevoGrupo.value = "";
  if(nombreMateria == "") {
    // mensaje error
    console.log("Pimero selecciona una materia");
    return;
  }
  if(materias[nombreMateria][nuevoGrupo] != null) {
    console.log("Ya existe ese grupo");
    return;
  }

  var newGrupo = document.createElement("option");
  newGrupo.innerText = nombreGrupo;
  newGrupo.value = nombreGrupo;
  selectGrupo.append(newGrupo);
  selectGrupo.value = nombreGrupo;

  currGrupo = new Grupo(nombreGrupo);
  materias[nombreMateria][currGrupo.name] = currGrupo;
  // materias[nombreMateria].push = currGrupo;
  grupos.innerHTML = "";
  grupos.append(createGrupo(currGrupo, "azul"));
  addHoraListeners();
});

// *********** Borrar ******************
function getOptionByValue(select, val) {
  var ops = select.options;
  for(var op of ops) {
    if(op.value == val) {
      return op;
    }
  }
  return null;
}
delMateria.addEventListener("click", ev => {
  var materiaDel = selectMateria.value;
  delete materias[materiaDel];
  selectMateria.removeChild(getOptionByValue(selectMateria, materiaDel));

  var materias_keys = Object.keys(materias);
  if(materias.length == 0) {
    grupos.innerHTML = "";
    selectMateria.innerHTML = "";
    selectGrupo.innerHTML = "";
  } else {
    intercambiaMateria(materias_keys[0]);
  }

});
delGrupo.addEventListener("click", ev => {
  var mat = selectMateria.value;
  var grupoDel = selectGrupo.value;
  delete materias[mat][grupoDel];
  selectGrupo.removeChild(getOptionByValue(selectGrupo, grupoDel));
  intercambiaGrupo(Object.keys(materias[mat])[0]);
});

// ---------- Socket -----------
var socket = io(); //('http://localhost:8081'); //.connect('http://localhost:8081');
var grupo = new Grupo();
// On connection
socket.on('connect', function(data){
  document.querySelector('#read').disabled = false;
  document.querySelector('#save').disabled = false;
  document.querySelector('#save').addEventListener('click', function() {
    console.log(materias);
    // var spreadMaterias = ...materias;
    socket.emit('save_file', {
      fileName: document.querySelector('#readFile').value,
      horario: materias
    }, res => {
      if(res.err) {
        console.error(err);
      } else {
        console.log("Se guardó el archivo con éxito");
      }
    });
  });
});

socket.on("message", function(msg) {
  document.querySelector('#messages').innerHTML += `<div>${msg}</div>`;
});
