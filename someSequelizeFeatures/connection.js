const sequelize = require('sequelize');

const sequelizeConnection = new sequelize(
    'learning',
    'db_user',
    '123456',
    {
        host: 'localhost',
        port: 3310,
        dialect: 'mysql'
    }
);

/* try {
    sequelizeConnection.authenticate().then(() => {
        console.log('connected');
    });
} catch (e) {
    console.log('connection failed!', e);
} */

async function getConnection() {
    try {
        await sequelizeConnection.authenticate();
        console.log('connected');

        return sequelizeConnection;
    } catch (e) {
        console.log('connection failed!', e);

        return e;
    }
}

exports.getConnection = getConnection;