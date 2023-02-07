export class ParseadorDeFecha{

    static parsearValor(value) {
        if (!value) {
          value = <Date><unknown>"Infinite"
        } else {
          value = new Date(value)
          value.setMinutes(value.getMinutes() + value.getTimezoneOffset())
          value = <Date><unknown>(("0" + value.getDate()).slice(-2) + "-" + ("0" + (value.getMonth() + 1)).slice(-2) + "-" + (value.getFullYear()) + " " + ("0" + value.getHours()).slice(-2) + ":" + ("0" + value.getMinutes()).slice(-2))
        }
        return value
      }

    static parsearFecha(validity){
        if (validity) {
          validity[0].value = this.parsearValor(validity[0].value)
          validity[0].value = validity[0].value =="Infinite" ? "-Infinite" : validity[0].value;
          validity[1].value = this.parsearValor(validity[1].value)
        }
        return validity
      }
    
}