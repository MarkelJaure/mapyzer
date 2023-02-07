const MENSAJE_ERROR = 'implementado en la subclase'

export class ValidadorDeColumnasFactory {
    static crearValidador(esquemaNro: string) {
        switch (esquemaNro) {
            case '1': return new ValidadorDeColumnasEsquema1
            case '2': return new ValidadorDeColumnasEsquema2
            case '3': return new ValidadorDeColumnasEsquema3
            case '4': return new ValidadorDeColumnasEsquema4
            default: return new ValidadorDeColumnasArchivo
        }
    }
}

export class ValidadorDeColumnasArchivo {

    alertService;
    optionsAlert;
    result;

    setAlertService(aAlertService) {
        this.alertService = aAlertService
    }

    setOptionsAlert(aOptionsAlert) {
        this.optionsAlert = aOptionsAlert
    }

    setResult(aResult) {
        this.result = aResult
    }

    validarColumnas() {
        throw new Error(MENSAJE_ERROR)
    }

    validarColumnasComunesATodosLosEsquemas(): boolean {
        if (this.validarColumna("codigo") && this.validarColumna("nombre") && this.validarColumna("descripcion")) {
            return true
        }
        return false
    }

    validarColumnasTInicioYTFinal(): boolean {
        if (this.validarColumna("tInicio") && this.validarColumna("tFinal")) {
            return true
        }
        return false
    }

    validarColumnasZonaYTipoLugar(): boolean {
        if (this.validarColumna("zona") && this.validarColumna("tipoLugar")) {
            return true
        }
        return false
    }

    validarColumna(columna: string): boolean {

        if (this.result[0].includes(columna)) {
            return true
        }
        this.alertService.error('El archivo no contiente la columna \' ' + columna + ' \', o es incorrecta.', this.optionsAlert)
        return false
    }
}

class ValidadorDeColumnasEsquema1 extends ValidadorDeColumnasArchivo {

    validarColumnas(): boolean {
        if (super.validarColumnasComunesATodosLosEsquemas()
            && super.validarColumnasZonaYTipoLugar()
            && this.validarColumnasLatYLon()
            && super.validarColumnasTInicioYTFinal()) {
            return true
        }
        super.alertService.error('El archivo no corresponde al esquema 1.', super.optionsAlert)
        return false
    }

    validarColumnasLatYLon(): boolean {
        if (super.validarColumna("lat") && super.validarColumna("lon")) {
            return true
        }
        return false
    }

}

class ValidadorDeColumnasEsquema2 extends ValidadorDeColumnasArchivo {

    validarColumnas(): boolean {
        if (super.validarColumnasComunesATodosLosEsquemas()
            && super.validarColumnasZonaYTipoLugar()
            && this.validarColumnasDireccion()
            && super.validarColumnasTInicioYTFinal()) {
            return true
        }
        super.alertService.error('El archivo no corresponde al esquema 2.', super.optionsAlert)
        return false
    }

    validarColumnasDireccion(): boolean {
        if (super.validarColumna("calle") && super.validarColumna("altura") && super.validarColumna("ciudad")) {
            return true
        }
        return false
    }
}

class ValidadorDeColumnasEsquema3 extends ValidadorDeColumnasArchivo {

    validarColumnas(): boolean {
        if (super.validarColumnasComunesATodosLosEsquemas() && super.validarColumna("tipoZona") &&
            super.validarColumnasTInicioYTFinal() && super.validarColumna("coordenadas")) {
            return true
        }
        super.alertService.error('El archivo no corresponde al esquema 3.', super.optionsAlert)
        return false
    }
}

class ValidadorDeColumnasEsquema4 extends ValidadorDeColumnasArchivo {


    validarColumnas(): boolean {
        if (super.validarColumnasComunesATodosLosEsquemas() && super.validarColumna("tipoTrayecto") &&
            super.validarColumnasTInicioYTFinal() && super.validarColumna("coordenadas")) {
            return true
        }
        super.alertService.error('El archivo no corresponde al esquema 4.', super.optionsAlert)
        return false
    }
}