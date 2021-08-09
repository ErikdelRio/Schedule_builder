class Grupo {
  name: string;
  horario: {
    [key: string]: boolean[]
  };
  constructor(name) {
    this.name = name;
    this.horario = {
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
