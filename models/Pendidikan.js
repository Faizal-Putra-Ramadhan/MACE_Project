import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Mahasiswa from './Mahasiswa.js';

const { DataTypes } = Sequelize;

const Pendidikan = sequelize.define('pendidikan', {
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_pt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat_pt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jurusan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semester_stase: {
        type: DataTypes.STRING,
        allowNull: false
    },
    judul_skripsi_disertasi: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Mahasiswa.hasOne(Pendidikan, { foreignKey: 'mahasiswa_id' });
Pendidikan.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

export default Pendidikan;
