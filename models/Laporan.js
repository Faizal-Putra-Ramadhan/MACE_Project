import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Pendaftaran from './Pendaftaran.js';

const { DataTypes } = Sequelize;

const Laporan = sequelize.define('laporan', {
    pendaftaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    surat_laporan_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fc_rekening_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bukti_pengeluaran_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status_verifikasi: {
        type: DataTypes.ENUM({
            values: ['pending', 'verified', 'revisi']
        }),
        allowNull: false,
        defaultValue: 'pending'
    },
    catatan_revisi: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: true
});

Pendaftaran.hasOne(Laporan, { foreignKey: 'pendaftaran_id' });
Laporan.belongsTo(Pendaftaran, { foreignKey: 'pendaftaran_id' });

export default Laporan;
