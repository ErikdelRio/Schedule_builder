var socket = io();

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

function addColorListeners() {
  var colorInputs = document.querySelectorAll(".colorMateria");
  for(var colorInput of colorInputs) {
    colorInput.addEventListener("change", ev => {
      var materia = ev.target.id.slice(5);
      updateSubjectColor(materia);
    });
  }
}
function addGroupSelectListeners(){
  var selects = document.querySelectorAll(".selectGrupo");
  for(var select of selects) {
    select.addEventListener("change", ev => {
      var grupo = ev.target.value;
      var materia = ev.target.id.slice(6);

      var materiaDiv = document.querySelector("#"+materia);
      materiaDiv.innerHTML = "";

      var new_group = createGrupo(materias[materia][grupo], "visible"+materia);
      materiaDiv.append(new_group);
      updateSubjectColor(materia);
      showIntersections();
    });
  }
}

function updateSubjectColor(name) {
  var colorInput = document.querySelector("#color"+name);
  if(colorInput) {
    var color = colorInput.value;
    var visibles = document.querySelectorAll(".visible"+name);
    for(var visible of visibles) {
      visible.style.backgroundColor = color + "80";
    }
  }
}

function updateAllSubjectColor() {
  for(var mat in materias) {
    updateSubjectColor(mat);
  }
}
function showIntersections() {
  var old_intersecs = document.querySelector("#intersec");
  if(old_intersecs) {
    old_intersecs.parentNode.removeChild(old_intersecs);
  }

  var interGrupo = new Grupo("intersec");
  var dias = ["lu", "ma", "mi", "ju", "vi", "sa", "do"]
  var divsGrupo = document.querySelectorAll(".selectGrupo");
  var arrGrupo = [... divsGrupo];
  var nom_grupos = arrGrupo.reduce((acc, curr)=>{
    var grupo = curr.value; //.slice(6);
    var materia = curr.id.slice(6);
    acc[materia] = grupo;
    return acc;
  }, {});
  for(var dia of dias) {
    for(var i = 0; i < 48; i++) {
      var nIntersecs = 0;
      for(var materia in nom_grupos) {
        if(materias[materia][nom_grupos[materia]].horario[dia][i]) {
          nIntersecs += 1;
        }
      }
      if(nIntersecs > 1) {
        interGrupo.horario[dia][i] = true;
      }
    }
  }
  var divGrupo = createGrupo(interGrupo, "intersectados");
  grupos.append(divGrupo);
  addIntersecColor();
}
function addIntersecColor() {
  var divsIntersecs = document.querySelectorAll(".intersectados");
  var intersecs = [... divsIntersecs];
  for(var inter of intersecs) {
    inter.style.backgroundColor = "#FF0000";
  }
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
    opciones.innerHTML = `
      <div>
        <input id="readFile" placeholder="Nombre archivo">
        <button id="read">Leer</button>
      </div>`;

    var materias_keys = Object.keys(materias);
    if(materias_keys.length == 0) {
      return;
    }
    for(var nomMateria of materias_keys) {
      var colorOp = document.createElement("input");
      colorOp.type = "color";
      colorOp.value = "#0000AA";
      colorOp.id = "color"+nomMateria;
      colorOp.className = "colorMateria";
      opciones.append(colorOp);

      var textoMateria = document.createElement("p");
      textoMateria.innerText = nomMateria;
      opciones.append(textoMateria);

      var selectGrupo = document.createElement("select");
      selectGrupo.id = "select" + nomMateria;
      selectGrupo.className = "selectGrupo";
      opciones.append(selectGrupo);

      for(var nomGrupo in materias[nomMateria]) {
        var opGrupo = document.createElement("option");
        opGrupo.value = nomGrupo;
        opGrupo.innerText = nomGrupo;
        selectGrupo.append(opGrupo);
      }

      opciones.append(document.createElement("br"));
      opciones.append(document.createElement("br"));

      var materiaDiv = document.createElement("div");
      materiaDiv.id = nomMateria;
      materiaDiv.className = "materiaHolder";
      grupos.append(materiaDiv)
      var gruposNoms = Object.keys(materias[nomMateria]);
      if(gruposNoms.length > 0) {
        var g = createGrupo(materias[nomMateria][gruposNoms[0]], "visible"+nomMateria);
        materiaDiv.append(g);
      }
    }

    updateAllSubjectColor();
    addColorListeners();
    addGroupSelectListeners();
    showIntersections();
  });
});

// ***************** sockets ********************
socket.on('connect', function(data){
  document.querySelector('#read').disabled = false;
});

createHorario();
var materias = {};
