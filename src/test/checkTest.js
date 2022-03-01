const expect = require('expect.js');
const ch = require('../check');
const chText = ch.check();

describe('Verificación de tipo dato y campos llenos', function () {

    it('Nombre y cedula no tienen valores ingresados', function () {
        expect(ch.check(null, null)).to.equal('[string number]');
    });

    it('Nombre no tiene valor ingresado y cedula está correcto', function () {
        expect(ch.check(null, 12345)).to.equal('[string number]');
    });

    it('Nombre está correcto y cedula no tiene valor ingresado ', function () {
        expect(ch.check("Pepita Arco", null)).to.equal('[string number]');
    });

    it('Nombre y cedula están llenandos correctamente', function () {
        expect(ch.check("Pepita Arco", 123456)).to.equal('[string number]');
    });
});
