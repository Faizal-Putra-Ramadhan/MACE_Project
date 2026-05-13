import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Pendaftaran from './Pendaftaran.js';

const { DataTypes } = Sequelize;

const DokumenPendaftaran = sequelize.define('dokumen_pendaftaran', {
    pendaftaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jenis_dokumen: {
        type: DataTypes.ENUM({
            values: [
                'surat_permohonan', 
                'rab', 
                'kartu_mahasiswa', 
                'ktp', 
                'sk_aktif', 
                'khs', 
                'kartu_keluarga', 
                'pasfoto', 
                'rekening'
            ]
        }),
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false
});

Pendaftaran.hasMany(DokumenPendaftaran, { foreignKey: 'pendaftaran_id' });
DokumenPendaftaran.belongsTo(Pendaftaran, { foreignKey: 'pendaftaran_id' });

export default DokumenPendaftaran;
