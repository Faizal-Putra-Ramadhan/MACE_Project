import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';

const { DataTypes } = Sequelize;

const User = sequelize.define('users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'admin'),
        allowNull: false,
        defaultValue: 'mahasiswa'
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default User;
