class Grupo {
  name: string;
  horario: {
    [key: string]: boolean[]
  };
  constructor() {
    this.horario = {
      // "lunes": new Array(48).fill(false),
      // "martes": new Array(48).fill(false),
      // "miercoles": new Array(48).fill(false),
      // "jueves": new Array(48).fill(false),
      // "viernes": new Array(48).fill(false),
      // "sabado": new Array(48).fill(false),
      // "domingo": new Array(48).fill(false)

      "lu": new Array(48).fill(false),
      "ma": new Array(48).fill(false),
      "mi": new Array(48).fill(false),
      "ju": new Array(48).fill(false),
      "vi": new Array(48).fill(false),
      "sa": new Array(48).fill(false),
      "do": new Array(48).fill(false)
    };
  }

  set_hour(day: string, hour: number, occupied: boolean) {
    this.horario[day][hour] = occupied;
  }

  add_hour(day, hour) {
    this.set_hour(day, hour, true)
  }
  del_hour(day, hour) {
    this.set_hour(day, hour, false);
  }
}
if (typeof module != 'undefined' && module.exports) {
  module.exports = {
    Grupo: Grupo
  }
}
