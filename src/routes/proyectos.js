const router = require('express').Router();

const Proyecto = require('../models/project');
const Anticipo = require('../models/anticipos');
const Cliente = require('../models/cliente');
const Requerimiento = require('../models/requerimiento')
const Factura = require('../models/factura')

router.get('/proyecto/add', (req, res) => {
    res.render('proyecto/crear');
});

router.post('/proyecto/nuevo', async(req, res) => {
    const { namep, fecha_inicio, fecha_fin, presupuesto } = req.body;
    const errors = [];
    if (!namep) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!fecha_inicio) {
        errors.push({ text: 'Por favor inserte una fecha de inicio' });
    }
    if (!fecha_fin) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if (!presupuesto) {
        errors.push({ text: 'Por favor inserte un presupuesto' });
    }
    if(errors.length > 0){
        res.render('proyecto/crear', {
            errors,
            namep,
            fecha_inicio,
            fecha_fin,
            presupuesto
        });
    } else {

        var total = 0;

        presupuesto.forEach( elemento => {
            total += parseInt(elemento.valor);
        });

        const newProyecto = Proyecto.build({namep: namep, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, presupuesto: total });
        await newProyecto.save();
        
        presupuesto.forEach( async(elemento) => {
            var req = await Requerimiento.create({ nombre: elemento.nombre, valor: elemento.valor })
            req.setProyecto(newProyecto);
            newProyecto.addRequerimiento(req);
        });
        
        res.redirect('/proyecto/lista');
    }
});

router.get('/proyecto/lista', async(req, res) => {
    const proyectos = await Proyecto.findAll({ order: [ [ 'date', 'DESC' ] ], include: [ Cliente ]});
    res.render("proyecto/lista", {proyectos});
});

router.get('/proyecto/modificar/:id',async(req, res) => {
    const proyectos = await Proyecto.findByPk(req.params.id);
    res.render('proyecto/editar', {proyectos});
});

router.post('/proyecto/editar/:id', async(req, res) => {
    const { namep, fecha_inicio, fecha_fin } = req.body;
    const proyectos = await Proyecto.findByPk(req.params.id);
    const errors = [];
    if (!namep) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!fecha_inicio) {
        errors.push({ text: 'Por favor inserte una fecha de inicio' });
    }
    if (!fecha_fin) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if(errors.length > 0){
        res.render('proyecto/editar', {
            proyectos,
            errors,
            namep,
            fecha_inicio,
            fecha_fin
        });
    } else {
        await Proyecto.update({ namep: namep, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin }, {
            where: {
                id: req.params.id, 
            }
        });
        res.redirect('/proyecto/lista');
    }
});

router.delete('/proyecto/eliminar/:id', async(req, res) =>{
    await Proyecto.destroy({
        where: {
            id: req.params.id, 
        }
    });
    res.redirect('/proyecto/lista');
})

router.get('/proyecto/anticipos/:id', async(req, res) => {
    const proyecto = await Proyecto.findByPk(req.params.id);
    console.log(proyecto)
    res.render('proyecto/anticipo', { proyecto });
});

router.post('/proyecto/anticipos/:id/crear', async(req, res) => {
    const { namean, valor } = req.body;
    const errors = [];
    if (!namean) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    const proyecto = await Proyecto.findByPk(req.params.id);
    if(errors.length > 0) {
        res.render(`proyecto/anticipo`, {
            proyecto,
            errors,
            namean,
            valor
        });
    } else {
        const anticipo = await Anticipo.create({ namean: namean, valor: valor });
        anticipo.setProyecto(proyecto);
        proyecto.addAnticipo(anticipo);
        proyecto.anticipo = proyecto.anticipo + anticipo.valor;
        proyecto.save()
        res.redirect('/proyecto/lista');
    }
});


router.get('/proyecto/actividades', (req, res) => {
    res.send('activiades compplementarias del proyecto');
});


router.get('/proyecto/compra', async(req, res) => {
    const proyectos = await Proyecto.findAll({ order: [ [ 'date', 'DESC' ] ], include: [ Cliente ]});
    res.render("proyecto/compras", {proyectos});
});

router.post('/proyecto/subirArchivo/:id', async (req,res) => {
    //const facturas = await Factura.findByPk(req.params.id);
    const {link}=req.body;
    const errors = [];
    //const {id}=req.params.id;
    const newFactura = Factura.build({link: link});
    if (!link) {
        errors.push({ text: 'Por favor inserte el link de la factura' });
    }
    if(errors.length > 0) {
        res.render(`/proyecto/subirArchivo`, {
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
        res.redirect('/proyecto/lista');
    }
    
    /*const errors = [];
    if (!linkFactura) {
        errors.push({ text: 'Por favor inserte el link de la factura' });
    } 
    if(errors.length > 0) {
        res.render(`/proyecto/subirArchivo`, {
            facturas,
            linkFactura
        });
    } else{
        const newFactura = await Factura.build({link: linkFactura });
        await newFactura.save();
        
        res.redirect('/proyecto/lista');
    }*/
    
})
/*router.post('/proyecto/subirArchivo',(req,res) => {
    let EDFile = req.files.file
    EDFile.mv(`./src/files/${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
    res.redirect('/proyecto/compra');
})*/

module.exports = router;