const router = require('express').Router();
const Personal = require('../models/personal')
const Proyecto = require('../models/project');


router.get('/personal/lista', async (req, res) => {
    const personal = await Personal.findAll({ include: Proyecto });
    res.render("personal/lista-personal", { personal });
});

router.get('/personal/add', (req, res) => {
    res.render('personal/crear-personal');
});

router.get('/personal/modificar/:id', async (req, res) => {
    const personal = await Personal.findByPk(req.params.id);
    res.render('personal/editar-personal', { personal });
});

router.get('/personal/:id_personal/asignar', async (req, res) => {
    const id_personal = req.params.id_personal
    const proyectos = await Proyecto.findAll();
    res.render('personal/ligar_proyecto', { id_personal: id_personal, proyectos: proyectos });
});

router.get('/personal/:id_personal/asignar/:id', async (req, res) => {
    const id_personal = req.params.id_personal
    const personal = await Personal.findByPk(id_personal);
    const proyecto = await Proyecto.findByPk(req.params.id);

    await personal.update({ proyectoId: proyecto.id }, {
        where: {
            id: req.params.id_personal,
        }
    });
    proyecto.setPersonals(personal);
    personal.setProyecto(proyecto);

    await proyecto.save()
    await personal.save()

    res.redirect('/personal/lista');


});

router.post('/personal/nuevo', async (req, res) => {
    const { numero, nombre, cedula, profesion, valor } = req.body;
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

    if (!profesion) {
        errors.push({ text: 'Por favor inserte una profesion' });
    }
    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    if (errors.length > 0) {
        res.render('personal/crear-personal', {
            errors,
            numero,
            nombre,
            cedula,
            profesion,
            valor
        });
    } else {
        const newPersonal = Personal.build({ numero: numero, nombre: nombre, cedula: cedula, profesion: profesion, valor: valor });
        await newPersonal.save();

        res.redirect('/personal/lista');
    }

});

router.post('/personal/editar-personal/:id', async (req, res) => {
    const { numero, nombre, cedula, profesion, valor } = req.body;
    const personal = await Personal.findByPk(req.params.id);
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
    if (!profesion) {
        errors.push({ text: 'Por favor inserte una profesion' });
    }

    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    if (errors.length > 0) {
        res.render('personal/editar-personal', {
            errors,
            personal,
            numero,
            nombre,
            cedula,
            profesion,
            valor
        });
    } else {
        await Personal.update({ numero: numero, nombre: nombre, cedula: cedula, profesion: profesion, valor: valor }, {
            where: {
                id: req.params.id,
            }
        });
        res.redirect('/personal/lista');
    }
});

router.delete('/personal/eliminar/:id', async (req, res) => {
    await Personal.destroy({
        where: {
            id: req.params.id,
        }
    });
    res.redirect('/personal/lista');
})






module.exports = router;