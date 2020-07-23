const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:caperimg:caper@localhost:5432/imgboard");

module.exports.getImages = () => {
    return db.query(`SELECT url, title FROM images ORDER BY created_at DESC;`);
};
