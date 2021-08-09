var dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

function createElementById(elem, id){
  var newElem = document.createElement(elem);
  newElem.id = id;
  return newElem;
}

function createHorario() {
  diasDiv.className = "columns7";
  horario.append(diasDiv);
  for (dia of dias) {
    let divDia = document.createElement("div");
    divDia.innerText = dia;
    diasDiv.append(divDia);
  }

  divHoras.className = "rows28";
  horario.append(divHoras);
  for(let j = 1; j <= 28; j++) {
    let divHora = document.createElement("div");
    let hora = 7 + ((j-1)*.5);
    divHora.innerText = hora;
    divHora.className = "miPadding";
    divHoras.append(divHora);
  }
}

function createGrupo(grupo, color) {
  var divGrupo = document.createElement("div");
  divGrupo.id = grupo.name;
  divGrupo.className = "grupo columns7 rows28";

  for(let j = 1; j <= 28; j++) {
    for (let i = 0; i < 7; i++) {
      let casilla = document.createElement("div");
      let curr_dia = dias[i].substring(0,2).replace('á', 'a')
      let id_casilla = curr_dia+j+grupo.name;
      casilla.id = id_casilla;
      if(grupo.horario[curr_dia][j+15]) {
        casilla.className = "hora "+color;
      } else {
        casilla.className = "hora transparente";
      }
      casilla.innerText = j;
      divGrupo.append(casilla);
    }
  }
  return divGrupo;
}
