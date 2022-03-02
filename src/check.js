module.exports = {

    check: function (nombre,cedula) {

        if(nombre === null){
            console.log("Por favor inserte un nombre")
        }
        if(cedula === null){
            console.log("Por favor inserte una cedula")
        }
        if(nombre != null && cedula != null ){
            console.log("Datos correctos")
        }
        return '['+typeof nombre +' '+ typeof cedula+']';
    }
};

