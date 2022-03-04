const router = require('express').Router();
const Proyecto = require('../models/project');
const Contrato = require('../models/contrato')
const Factura = require('../models/factura')
const Cliente = require('../models/cliente');

// PARTE DE CONTRATOS

router.get('/ejecucion/contratost', async (req,res) =>{
    const contratos = await Contrato.findAll({ include: Proyecto });
    res.render("ejecucion/lista-contratos", { contratos });
});

router.get('/ejecucion/crear-contratost', (req,res) =>{
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
        await contrato.update({ proyectoId: proyecto.id}, {
            where: {
                id: req.params.id_contrato,
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
            contratos,
            numero,
            nombre,
            cedula,
            fecha_inicio,
            fecha_fin,
            valor
        });
    } else {
        await Contrato.update({ numero: numero, nombre: nombre, cedula: cedula, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, valor: valor  }, {
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
router.get('/ejecucion/compra', async(req, res) => {
    const proyectos = await Proyecto.findAll({ order: [ [ 'date', 'DESC' ] ], include: [ Cliente ]});
    res.render("ejecucion/compras", {proyectos});
});

router.post('/ejecucion/subirArchivo/:id', async (req,res) => {
    //const facturas = await Factura.findByPk(req.params.id);
    const {link}=req.body;
    const errors = [];
    //const {id}=req.params.id;
    const newFactura = Factura.build({link: link});
    if (!link) {
        errors.push({ text: 'Por favor inserte el link de la factura' });
    }
    if(errors.length > 0) {
        res.render(`/ejecucion/subirArchivo`, {
            newFactura,
            link
        });
    } else{
        await newFactura.update({link: link, proyectoId: req.params.id}, {
            where: {
                proyectoId: null,
            }
        });
        await newFactura.save();
        res.redirect('/ejecucion/contratost');
    }
});

module.exports = router;