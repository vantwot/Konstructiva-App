const router = require('express').Router();

const Cliente = require('../models/cliente');
const Proyecto = require('../models/project');

router.get('/cliente/lista', async (req, res) =>{
    const clientes = await Cliente.findAll({include: Proyecto });
    res.render("cliente/lista", { clientes });
});

router.get('/cliente/add', (req,res) =>{
    res.render('cliente/crear');
});

router.post('/cliente/nuevo', async (req,res) =>{
    const { nombre, cedula } = req.body;
    const errors = [];
    if (!nombre) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!cedula) {
        errors.push({ text: 'Por favor inserte una cedula' });
    }
    if(errors.length > 0){
        res.render('cliente/crear', {
            errors,
            nombre,
            cedula,
        });
    } else{
        const newCliente = Cliente.build({nombre: nombre, cedula: cedula });
        await newCliente.save();
        res.redirect('/cliente/lista');
    }
});

router.get('/cliente/modificar/:id', async (req,res) =>{
    const clientes = await Cliente.findByPk(req.params.id);
    res.render('cliente/editar', {clientes});
});

router.post('/cliente/editar/:id', async(req, res) => {
    const clientes = await Cliente.findByPk(req.params.id);
    const { nombre, cedula } = req.body;
    const errors = [];
    if (!nombre) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!cedula) {
        errors.push({ text: 'Por favor inserte una cedula' });
    }
    if(errors.length > 0){
        res.render('cliente/editar', {
            clientes,
            errors,
            nombre,
            cedula,
        });
    } else {
        await Cliente.update({nombre: nombre, cedula: cedula }, {
            where: {
                id: req.params.id, 
            }
        });
        res.redirect('/cliente/lista');
    }
});

router.delete('/cliente/eliminar/:id', async(req, res) =>{
    await Cliente.destroy({
        where: {
            id: req.params.id, 
        }
    });
    res.redirect('/cliente/lista');
})

router.get('/cliente/:id_cliente/asignar', async (req, res) =>{
    const id_cliente = req.params.id_cliente
    const proyectos = await Proyecto.findAll();
    res.render('cliente/ligar_proyecto', { id_cliente: id_cliente, proyectos: proyectos });
});

router.get('/cliente/:id_cliente/asignar/:id', async (req, res) => {
    const cliente = await Cliente.findByPk(req.params.id_cliente);
    const proyecto = await Proyecto.findByPk(req.params.id);
    proyecto.setCliente(cliente);
    cliente.setProyecto(proyecto);
    await proyecto.save()
    await cliente.save()
    res.redirect('/cliente/lista');
});

module.exports = router;