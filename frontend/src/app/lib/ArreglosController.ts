export class ArreglosController {

    static interseccionArreglos(array1, array2) {
        return array1.filter(value => array2.includes(value));
    }

    static ordenar(array) {
        array.sort();
    }

    static unionArreglos(array1, array2) {
        let array3 = array1.concat(array2);
        array3 = array3.filter((item, index) => {
            return (array3.indexOf(item) == index)
        });
        return array3;
    }

}