const MENSAJE_ERROR = 'implementado en la subclase'
import {LUGAR,ZONA,TRAYECTO} from "../data.config";

export class FiltroFactory {

    static crearFiltro(tipoFiltro: string){
        switch (tipoFiltro){
            case LUGAR: return new FiltrosLugar;
            case ZONA: return new FiltrosZona;
            case TRAYECTO: return new FiltrosTrayecto;
            default: return new FiltroController;
        }
    }
}

export class FiltroController {

  tipoDeChecked = new Array();
  tiposDe = new Array();
  hideIsChecked: boolean = false;

  removeByTipoDe(data, visualData, tipoDe) {
    throw new Error(MENSAJE_ERROR)
  }

  addByTipoDe(data, visualData, tipoDe) {
    throw new Error(MENSAJE_ERROR)
  }

  clearAll(map, visualData) {
    for (const aVisualData of visualData) {
      map.removeLayer(aVisualData);
    }
  }

  areValidByFiltros(aData, visualData) {
    return new Array();
  }

  tiposContains(tipoDe) {
    return (this.tiposDe.includes(tipoDe))
  }

  tipoDeCheckedContains(tipoDe) {
    return (this.tipoDeChecked.includes(tipoDe))
  }

  addAllTiposToTiposDe(data) {
    throw new Error(MENSAJE_ERROR)
  }

  addToTipoDeChecked(tipoDe) {
    if (!this.tipoDeChecked.includes(tipoDe)) {
      this.tipoDeChecked.push(tipoDe);
    }
  }

  removeToTipoDeChecked(tipoDeChecked, tipoDe) {
    return tipoDeChecked.filter(function (ele) {
      return ele != tipoDe;
    });
  }

  protected addToTiposDe(tipoDe) {
    if (!this.tiposDe.includes(tipoDe)) {
      this.tiposDe.push(tipoDe)
    }
  }
}

class FiltrosLugar extends FiltroController {

  removeByTipoDe(lugares, markers, tipoLugar) {
    const invalidMarkers = new Array();
    for (let i = 0; i < lugares.length; i++) {
      if (lugares[i].tipos_lugare.tipo_lugar == tipoLugar) {
        invalidMarkers.push(markers[i])
      }
    }
    return invalidMarkers
  }

  addByTipoDe(lugares, markers, tipoLugar) {
    const validMarkers = new Array();
    for (let i = 0; i < lugares.length; i++) {
      if (lugares[i].tipos_lugare.tipo_lugar == tipoLugar) {
        validMarkers.push(markers[i])
      }
    }
    return validMarkers
  }

  addAllTiposToTiposDe(lugares) {
    for (const lugar of lugares) {
      super.addToTiposDe(lugar.tipos_lugare.tipo_lugar);
    }
  }

  areValidByFiltros(lugares, markers) {
    const lugaresValidos = new Array()
    if (!this.hideIsChecked) {
      for (let i = 0; i < lugares.length; i++) {
        if (!super.tipoDeCheckedContains(lugares[i].tipos_lugare.tipo_lugar)) {
          lugaresValidos.push(markers[i])
        }
      }
    }
    return lugaresValidos
  }

}

class FiltrosZona extends FiltroController {

  removeByTipoDe(zonas, polygons, tipoZona) {
    const invalidPolygons = new Array();
    for (let i = 0; i < zonas.length; i++) {
      if (zonas[i].tipos_zona.tipo_zona == tipoZona) {
        invalidPolygons.push(polygons[i]);
      }
    }
    return invalidPolygons
  }

  addByTipoDe(zonas, polygons, tipoZona) {
    const validPolygons = new Array();
    for (let i = 0; i < zonas.length; i++) {
      if (zonas[i].tipos_zona.tipo_zona == tipoZona) {
        validPolygons.push(polygons[i]);
      }
    }
    return validPolygons
  }

  addAllTiposToTiposDe(zonas) {
    for (const zona of zonas) {
      super.addToTiposDe(zona.tipos_zona.tipo_zona);
    }
  }

  areValidByFiltros(zonas, polygons) {
    const validPolygons = new Array()
    if (!this.hideIsChecked) {
      for (let i = 0; i < zonas.length; i++) {
        if (!super.tipoDeCheckedContains(zonas[i].tipos_zona.tipo_zona)) {
          validPolygons.push(polygons[i])
        }
      }
    }
    return validPolygons
  }

}

class FiltrosTrayecto extends FiltroController {

  removeByTipoDe(trayectos, linestrings, tipoTrayecto) {
    const invalidLinestrings = new Array()
    for (let i = 0; i < trayectos.length; i++) {
      if (trayectos[i].tipos_trayecto.tipo_trayecto == tipoTrayecto) {
        invalidLinestrings.push(linestrings[i])
      }
    }
    return invalidLinestrings
  }

  addByTipoDe(trayectos, linestrings, tipoTrayecto) {
    const validLinestrings = new Array()
    for (let i = 0; i < trayectos.length; i++) {
      if (trayectos[i].tipos_trayecto.tipo_trayecto == tipoTrayecto) {
        validLinestrings.push(linestrings[i])
      }
    }
    return validLinestrings
  }

  addAllTiposToTiposDe(trayectos) {
    for (const trayecto of trayectos) {
      super.addToTiposDe(trayecto.tipos_trayecto.tipo_trayecto);
    }
  }

  areValidByFiltros(trayectos, linestrings) {
    const trayectosValidos = new Array()
    if (!this.hideIsChecked) {
      for (let i = 0; i < trayectos.length; i++) {
        if (!super.tipoDeCheckedContains(trayectos[i].tipos_trayecto.tipo_trayecto)) {
          trayectosValidos.push(linestrings[i])
        }
      }
    }
    return trayectosValidos
  }
}