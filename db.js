const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:caperimg:caper@localhost:5432/imgboard");

//exports getImages request
module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 6;`);
};

module.exports.addImages = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [url, username, title, description]
    );
};

module.exports.getImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1;`, [id]);
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC;`,
        [id]
    );
};

module.exports.addComment = (commenter, comment, image_id) => {
    return db.query(
        `INSERT INTO comments (commenter, comment, image_id) VALUES ($1, $2, $3) RETURNING *;`,
        [commenter, comment, image_id]
    );
};

module.exports.showMore = (id) => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images ORDER BY id ASC LIMIT 1
        ) AS lowest_id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6;`,
        [id]
    );
};
