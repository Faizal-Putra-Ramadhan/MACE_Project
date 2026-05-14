import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './User.js';

const { DataTypes } = Sequelize;

const Mahasiswa = sequelize.define('mahasiswa', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nim: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alamat_domisili: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    alamat_ktp: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nama_orang_tua: {
        type: DataTypes.STRING,
        allowNull: true
    },
    perguruan_tinggi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    program_studi: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

User.hasOne(Mahasiswa, { foreignKey: 'user_id' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });

export default Mahasiswa;
