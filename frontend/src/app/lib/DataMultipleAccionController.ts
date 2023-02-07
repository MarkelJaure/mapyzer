export class DataMultipleAccionController {

    dataToCopy = new Array() as Array<number>;
    dataToDelete = new Array() as Array<number>;
    allDataToCopyIsSelected: boolean = false;
    allDataToDeleteIsSelected: boolean = false;

    copyData(aService, aProyecto) {
        if (this.dataToCopy.length > 0) {
            aService.copyData(this.dataToCopy, aProyecto).subscribe();
        }
    }

    deleteData(aService, aProyecto) {
        if (this.dataToDelete.length > 0) {
            aService.deleteData(this.dataToDelete, aProyecto).subscribe();
        }
    }

    dataToCopyContains(id: number) {
        return (this.dataToCopy.indexOf(id) > -1)
    }

    dataToDeleteContains(id: number) {
        return (this.dataToDelete.indexOf(id) > -1)
    }

    toggleDataToCopySeleccionado(id: number, data) {
        this.dataToCopy.indexOf(id) > -1 ? this.dataToCopy.splice(this.dataToCopy.indexOf(id), 1) : this.dataToCopy.push(id) //toggle checkbox
        this.dataToCopy.sort((a, b) => (a - b));
        this.showDataToCopySeleccionados(data);
    }

    toggleDataToDeleteSeleccionado(id: number, data) {
        this.dataToDelete.indexOf(id) > -1 ? this.dataToDelete.splice(this.dataToDelete.indexOf(id), 1) : this.dataToDelete.push(id) //toggle checkbox
        this.dataToDelete.sort((a, b) => (a - b));
        this.showDataToDeleteSeleccionados(data);
    }

    showDataToCopySeleccionados(data) {
        this.allDataToCopyIsSelected = (this.dataToCopy.length < data.length) ? false : true;
        return this.allDataToCopyIsSelected;
    }

    showDataToDeleteSeleccionados(data) {
        this.allDataToDeleteIsSelected = (this.dataToDelete.length < data.length) ? false : true;
        return this.allDataToDeleteIsSelected;
    }

    toggleAllDataToCopySeleccionados(data) {

        if (data != null) {

            if (this.allDataToCopyIsSelected) {

                this.allDataToCopyIsSelected = false;

                data.forEach(dato => {
                    if (this.dataToCopy.includes(dato.id)) {
                        this.toggleDataToCopySeleccionado(dato.id, data);
                    }

                });

            } else {
                this.allDataToCopyIsSelected = true;
                data.forEach(dato => {
                    if (!this.dataToCopy.includes(dato.id)) {
                        this.toggleDataToCopySeleccionado(dato.id, data);
                    }
                });
            }
        }
    }

    toggleAllDataToDeleteSeleccionados(data) {

        if (data != null) {

            if (this.allDataToDeleteIsSelected) {

                this.allDataToDeleteIsSelected = false;

                data.forEach(dato => {
                    if (this.dataToDelete.includes(dato.id)) {
                        this.toggleDataToDeleteSeleccionado(dato.id, data);
                    }

                });
            } else {
                this.allDataToDeleteIsSelected = true;
                data.forEach(dato => {
                    if (!this.dataToDelete.includes(dato.id)) {
                        this.toggleDataToDeleteSeleccionado(dato.id, data);
                    }
                });
            }
        }
    }
}