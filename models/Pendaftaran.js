import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Mahasiswa from './Mahasiswa.js';

const { DataTypes } = Sequelize;

const Pendaftaran = sequelize.define('pendaftaran', {
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    program: {
        type: DataTypes.ENUM({
            values: ['A', 'B', 'C', 'D', 'E']
        }),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM({
            values: ['draft', 'submitted', 'lolos_berkas', 'ditolak', 'selesai']
        }),
        allowNull: false,
        defaultValue: 'submitted'
    },
    alasan_penolakan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    jumlah_dana: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
    },
    kode_kartu: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Mahasiswa.hasMany(Pendaftaran, { foreignKey: 'mahasiswa_id' });
Pendaftaran.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

export default Pendaftaran;
