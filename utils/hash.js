const bcrypt = require("bcrypt");
const saltRounds = 12;

// Hash a password
const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

// Compare a password with a hash
const comparePassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    }
    catch (err) {
        console.error("Error comparing password:", err);
        throw err;
    }
}

module.exports = {
    hashPassword,
    comparePassword
}

