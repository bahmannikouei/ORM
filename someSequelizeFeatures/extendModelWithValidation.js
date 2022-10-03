const { Model, DataTypes } = require('sequelize');
const getConnection = require('./connection').getConnection;

class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            firstName: {
                type: DataTypes.STRING,
                validate: {
                    isAlpha: {
                        msg: "نام نمی‌تواند شامل اعداد باشد."
                    } // will only allow letters
                }
            },
            lastName: {
                type: DataTypes.STRING,
                validate: {
                    isInt: {
                        msg: "Must be an integer number of pennies"
                    }
                }
            },
            age: {
                type: DataTypes.INTEGER.UNSIGNED,
                validate: {
                    isEven(value) {
                        if (parseInt(value) % 2 !== 0) {
                            throw new Error('Only even values are allowed!');
                        }
                    },
                    isGreaterThanOtherField(value) {
                        if (parseInt(value) <= parseInt(this.otherField)) {
                            throw new Error('Bar must be greater than otherField.');
                        }
                    }
                }
            }
        }, {
            sequelize,
            validate: {
                onlyOneCanBeNull() {
                    if (this.firstName == null && this.lastName == null) {
                        throw new Error('firstname and lastname can not be null both of them!');
                    }
                }
            },
            paranoid: true,

            // If you want to give a custom name to the deletedAt column
            // deletedAt: 'destroy_time'
        });
    }

    fullname() {
        return `${this.firstName} ${this.lastName}`;
    }
}

getConnection().then((sequelizeConnection) => {
    // You don't need to capture the return here, I'm just doing it to show what it is.
    const result = User.init(sequelizeConnection, DataTypes);
    // console.log(result === User); // true

    // const user = new User();
    // console.log(typeof user.fullname === 'function'); // true
    User.create({ firstName: 123456 });
});