
const router = require('express').Router();
const Proyecto = require('../models/project');
const Contrato = require('../models/contrato')
const Factura = require('../models/factura')
const Cliente = require('../models/cliente');
const Material = require('../models/material')
const { jsPDF } = require("jspdf");

// PARTE DE CONTRATOS

router.get('/ejecucion/contratost', async (req, res) => {
    const contratos = await Contrato.findAll({ include: Proyecto });
    res.render("ejecucion/lista-contratos", { contratos });
});

router.get('/ejecucion/crear-contratost', (req, res) => {
    res.render('ejecucion/crear-contratos');
});

router.get('/ejecucion/modificar/:id', async (req, res) => {
    const contratos = await Contrato.findByPk(req.params.id);
    res.render('ejecucion/editar-contratos', { contratos });
});

router.delete('/ejecucion/eliminar/:id', async (req, res) => {
    await Contrato.destroy({
        where: {
            id: req.params.id,
        }
    });
    res.redirect('/ejecucion/contratost');
})

router.get('/ejecucion/user', (req, res) => {
    res.render('users/vistaCompras');
});

router.get('/ejecucion/:id_contrato/asignar', async (req, res) => {
    const id_contrato = req.params.id_contrato
    const proyectos = await Proyecto.findAll();
    res.render('ejecucion/ligar_proyecto', { id_contrato: id_contrato, proyectos: proyectos });
});

router.get('/ejecucion/:id_contrato/asignar/:id', async (req, res) => {
    const id_contrato = req.params.id_contrato
    const contrato = await Contrato.findByPk(id_contrato);
    const proyectos = await Proyecto.findAll();
    const proyecto = await Proyecto.findByPk(req.params.id);
    const errors = [];
    if (contrato.valor > proyecto.anticipo) {
        errors.push({ text: 'El valor del contrato es mayor que el anticipo' });
        res.render('ejecucion/ligar_proyecto', {
            errors,
            id_contrato,
            proyectos

        });

    }
    else {
        await contrato.update({ proyectoId: proyecto.id }, {
            where: {
                id: req.params.id_contrato,
            }
        });

        await proyecto.update({ anticipo: proyecto.anticipo - contrato.valor }, {
            where: {
                id: req.params.id,
            }
        });
        proyecto.setContratos(contrato);
        contrato.setProyecto(proyecto);

        //ASIGNARLE EL CONTRATO AL PROYECTO, NO SE COMO SE HACE YA QUE EN PROYECTO NO HAY NINGUN CAMPO PARA CONTRATOS proyecto.setContratos(contrato);
        await proyecto.save()
        await contrato.save()

        res.redirect('/ejecucion/contratost');
    }

});

router.post('/ejecucion/editar-contratos/:id', async (req, res) => {
    const { numero, nombre, cedula, fecha_inicio, fecha_fin, valor } = req.body;
    const contratos = await Contrato.findByPk(req.params.id);
    const errors = [];
    if (!numero) {
        errors.push({ text: 'Por favor inserte un numero de contrato' });
    }
    if (!nombre) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!cedula) {
        errors.push({ text: 'Por favor inserte una cedula' });
    }
    if (!fecha_inicio) {
        errors.push({ text: 'Por favor inserte una fecha de inicio' });
    }
    if (!fecha_fin) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    if (errors.length > 0) {
        res.render('ejecucion/editar-contratos', {
            errors,
            contratos,
            numero,
            nombre,
            cedula,
            fecha_inicio,
            fecha_fin,
            valor
        });
    } else {
        await Contrato.update({ numero: numero, nombre: nombre, cedula: cedula, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, valor: valor }, {
            where: {
                id: req.params.id,
            }
        });
        res.redirect('/ejecucion/contratost');
    }
});

router.post('/ejecucion/nuevo-contratost', async (req, res) => {
    const { numero, nombre, cedula, fecha_inicio, fecha_fin, valor } = req.body;
    const errors = [];
    if (!numero) {
        errors.push({ text: 'Por favor inserte un numero de contrato' });
    }
    if (!nombre) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!cedula) {
        errors.push({ text: 'Por favor inserte una cedula' });
    }
    if (!fecha_inicio) {
        errors.push({ text: 'Por favor inserte una fecha de inicio' });
    }
    if (!fecha_fin) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    if (errors.length > 0) {
        res.render('ejecucion/crear-contratos', {
            errors,
            numero,
            nombre,
            cedula,
            fecha_inicio,
            fecha_fin,
            valor
        });
    } else {
        const newContrato = Contrato.build({ numero: numero, nombre: nombre, cedula: cedula, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, valor: valor });
        await newContrato.save();

        res.redirect('/ejecucion/contratost');
    }

});

//PARTE DE FACTURAS

router.get('/user/compras', async (req, res) => {
    const facturas = await Factura.findAll({ include: Proyecto });
    res.render("users/vistaCompras", { facturas });
});

router.get('/user/crear', (req, res) => {
    res.render('users/crearFactura');
});

router.get('/factura/crear', (req, res) => {
    res.render('ejecucion/crearFactura');
});

router.get('/factura/lista', async (req, res) => {
    const facturas = await Factura.findAll({ include: Proyecto });
    res.render("ejecucion/listaFactura", { facturas });
});



router.post('/factura/nuevo', async (req, res) => {
    const { numero, nombre, direccion, ciudad, telefono, valorTotal } = req.body;
    var total = 0;

    valorTotal.forEach(elemento => {
        total += parseInt(elemento.valor);
    });

    const newFactura = Factura.build({ numero: numero, nombre: nombre, direccion: direccion, ciudad: ciudad, telefono: telefono, valorTotal: total });
    await newFactura.save();

    valorTotal.forEach(async (elemento) => {
        var req = await Material.create({ nombre: elemento.nombre, valor: elemento.valor })
        req.setFactura(newFactura);
        newFactura.addMaterial(req);
    });

    res.redirect('/factura/lista');

});

router.delete('/ejecucion/eliminarFactura/:id', async (req, res) => {

    await Factura.destroy({
        where: {
            id: req.params.id,
        }
    });
    await Material.destroy({
        where: {
            facturaId: req.params.id,
        }
    });

    res.redirect('/factura/lista');
})

router.get('/factura/:id_factura/asignar', async (req, res) => {
    const id_factura = req.params.id_factura
    const proyectos = await Proyecto.findAll();
    res.render('ejecucion/ligar_factura', { id_factura: id_factura, proyectos: proyectos });
});

router.get('/factura/:id_factura/asignar/:id', async (req, res) => {
    const id_factura = req.params.id_factura
    const factura = await Factura.findByPk(id_factura);
    const proyecto = await Proyecto.findByPk(req.params.id);

    await factura.update({ proyectoId: proyecto.id }, {
        where: {
            id: req.params.id_factura,
        }
    });

    proyecto.setFacturas(factura);
    factura.setProyecto(proyecto);

    //ASIGNARLE EL CONTRATO AL PROYECTO, NO SE COMO SE HACE YA QUE EN PROYECTO NO HAY NINGUN CAMPO PARA CONTRATOS proyecto.setContratos(contrato);
    await proyecto.save()
    await factura.save()

    res.redirect('/factura/lista');


});

router.get('/factura/:id_factura/ver', async (req, res) => {
    const id_factura = req.params.id_factura
    const factura = await Factura.findByPk(id_factura, { include: Material });
    const materiales = factura.materials;


    
    const doc = new jsPDF({
    })
    doc.setTextColor(0,255,52,0)
    let pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Factura # "+ factura.numero,pageWidth / 2, 20, 'center');
    doc.setTextColor(255,255,255,255)
    doc.text("Nombre: "+ factura.nombre,pageWidth / 2, 30, 'center');
    doc.text("Direccion: "+ factura.direccion,pageWidth / 2, 40, 'center');
    doc.text("Ciudad: "+ factura.ciudad,pageWidth / 2, 50, 'center');
    doc.text("Telefono: "+ factura.telefono,pageWidth / 2, 60, 'center');
    doc.setTextColor(0,255,52,0)
    doc.text("Lista De Materiales: ",pageWidth / 2, 80, 'center');
    doc.setTextColor(255,0,0,0)
    doc.text("  Nombre ",pageWidth / 3.1, 90, 'center');
    doc.text("  Valor ",pageWidth / 1.5, 90, 'center');
    doc.setTextColor(255,255,255,255)
    var i = 0
    for (var i = 0; i < materiales.length; i++) {
        doc.text(""+materiales[i].nombre, pageWidth / 3.5, (i*10)+100);
        doc.text(""+materiales[i].valor, pageWidth / 1.5, (i*10)+100);
     }
     doc.setTextColor(0,255,52,0)
    doc.text("Total : "+ factura.valorTotal,pageWidth / 2, 160, 'center');
    doc.save(__dirname + "/facturas/" + id_factura + ".pdf")
    res.sendFile(__dirname + "/facturas/" + id_factura + ".pdf");
    


});

router.get('/factura/modificar/:id',async(req, res) => {
    const facturas = await Factura.findByPk(req.params.id);
    res.render('ejecucion/editarFactura', {facturas});
});

router.post('/ejecucion/editarFactura/:id', async(req, res) => {
    const { numero, nombre, direccion, ciudad, telefono } = req.body;
    const facturas = await Factura.findByPk(req.params.id);
    const errors = [];
    if (!numero) {
        errors.push({ text: 'Por favor inserte un número de factura' });
    }
    if (!nombre) {
        errors.push({ text: 'Por favor inserte una fecha de nombre' });
    }
    if (!direccion) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if (!ciudad) {
        errors.push({ text: 'Por favor inserte una ciudad' });
    }
    if (!telefono) {
        errors.push({ text: 'Por favor inserte un telefono' });
    }
    if(errors.length > 0){
        res.render('ejecucion/editarFactura', {
            facturas,
            errors,
            numero,
            nombre,
            direccion,
            ciudad,
            telefono
        });
    } else {
        await Factura.update({ numero: numero, nombre: nombre, direccion: direccion, ciudad: ciudad, telefono: telefono }, {
            where: {
                id: req.params.id, 
            }
        });
        res.redirect('/factura/lista');
    }
});

module.exports = router;