const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPass = async (pass) => {
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
};

helpers.matchPass = async (pass, savedPass) => {
    try {
        return await bcrypt.compare(pass, savedPass);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;