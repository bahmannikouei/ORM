const { gzipSync, gunzipSync } = require('zlib');

const { Model, DataTypes } = require('sequelize');
const getConnection = require('./connection').getConnection;

class Post extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            description: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.content} ${this.createdAt}`;
                },
                set(value) {
                    throw new Error('Do not try to set the `fullName` value!');
                }
            },
            content: {
                type: DataTypes.TEXT,
                get() {
                    const storedValue = this.getDataValue('content');
                    const gzippedBuffer = Buffer.from(storedValue, 'base64');
                    const unzippedBuffer = gunzipSync(gzippedBuffer);
                    return unzippedBuffer.toString();
                },
                set(value) {
                    const gzippedBuffer = gzipSync(value);
                    this.setDataValue('content', gzippedBuffer.toString('base64'));
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at'
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at'
            }
        }, {
            sequelize,
            tableName: 'posts'
        });
    }
}

getConnection().then((sequelizeConnection) => {
    // You don't need to capture the return here, I'm just doing it to show what it is.
    const result = Post.init(sequelizeConnection, DataTypes);
    console.log(result === Post); // true

    Post.create({ content: 'Hello everyone!' }).then((post) => {
        // console.log(post.description); // Hello everyone! Mon Jul 05 2021 05:34:24 GMT+0430 (Iran Daylight Time)

        console.log('here::::::', post.content); // 'Hello everyone!'
        // Everything is happening under the hood, so we can even forget that the
        // content is actually being stored as a gzipped base64 string!

        // However, if we are really curious, we can get the 'raw' data...
        console.log(post.getDataValue('content'));
        // Output: 'H4sIAAAAAAAACvNIzcnJV0gtSy2qzM9LVQQAUuk9jQ8AAAA='
    });
});
