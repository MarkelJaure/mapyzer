
export class VerEnElTiempoController {
  
    clearNonInfinite(data, visualData) {
      const nonInfiniteData = new Array()
      for (let i = 0; i < data.length; i++) {
        if (data[i].validity[0].value != null) {
          nonInfiniteData.push(visualData[i])
        }
      }
      return nonInfiniteData
    }
  
    addFechasForTemporarySlider(data, fechaRef) {
      for (const aData of data) {
        this.addFechaToFechaRef(aData.validity[0].value, fechaRef)
        this.addFechaToFechaRef(aData.validity[1].value, fechaRef)
      }
    }
  
    areValidByFecha(data, visualData, aDate) {
      const datosValidos = new Array()
      for (let i = 0; i < data.length; i++) {
        if (this.isValidInDate(data[i].validity[0].value, data[i].validity[1].value, aDate)) {
          datosValidos.push(visualData[i]);
        }
      }
      return datosValidos
    }
  
    private addFechaToFechaRef(aDate, fechaRef) {
      if (aDate != null && !fechaRef.includes(aDate)) {
        fechaRef.push(aDate);
      }
    }
  
    isValidInDate(aDateBefore: Date, aDateAfter: Date, aDateValid: Date) {
      return this.isDateBefore(aDateBefore, aDateValid) && this.isDateBefore(aDateValid, aDateAfter)
    }
  
    private isDateBefore(aDateBefore: Date, aDateAfter: Date) {
  
      if (aDateBefore == null || aDateAfter == null) {
        return true
      }
  
      if (aDateBefore <= aDateAfter) {
        return true
      }
  
      return false
    }
  }