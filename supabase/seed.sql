-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE "enum_users_role" AS ENUM('mahasiswa', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "enum_pendaftaran_program" AS ENUM('A', 'B', 'C', 'D', 'E');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "enum_pendaftaran_status" AS ENUM('draft', 'submitted', 'lolos_berkas', 'ditolak', 'selesai');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "enum_dokumen_pendaftaran_jenis_dokumen" AS ENUM('surat_permohonan', 'rab', 'kartu_mahasiswa', 'ktp', 'sk_aktif', 'khs', 'kartu_keluarga', 'pasfoto', 'rekening');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "enum_laporan_status_verifikasi" AS ENUM('pending', 'verified', 'revisi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Tables
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" "enum_users_role" DEFAULT 'mahasiswa',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "mahasiswa" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"(id),
    "nim" VARCHAR(255) NOT NULL UNIQUE,
    "nik" VARCHAR(255) NOT NULL UNIQUE,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(255),
    "alamat_domisili" TEXT,
    "alamat_ktp" TEXT,
    "nama_orang_tua" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "pendidikan" (
    "id" SERIAL PRIMARY KEY,
    "mahasiswa_id" INTEGER REFERENCES "mahasiswa"(id),
    "nama_pt" VARCHAR(255) NOT NULL,
    "alamat_pt" TEXT NOT NULL,
    "fakultas" VARCHAR(255) NOT NULL,
    "jurusan" VARCHAR(255) NOT NULL,
    "prodi" VARCHAR(255) NOT NULL,
    "semester_stase" VARCHAR(255) NOT NULL,
    "judul_skripsi_disertasi" TEXT
);

CREATE TABLE IF NOT EXISTS "pendaftaran" (
    "id" SERIAL PRIMARY KEY,
    "mahasiswa_id" INTEGER REFERENCES "mahasiswa"(id),
    "program" "enum_pendaftaran_program" NOT NULL,
    "status" "enum_pendaftaran_status" DEFAULT 'submitted',
    "alasan_penolakan" TEXT,
    "kode_kartu" VARCHAR(255) UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "dokumen_pendaftaran" (
    "id" SERIAL PRIMARY KEY,
    "pendaftaran_id" INTEGER REFERENCES "pendaftaran"(id),
    "jenis_dokumen" "enum_dokumen_pendaftaran_jenis_dokumen" NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "uploaded_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "laporan" (
    "id" SERIAL PRIMARY KEY,
    "pendaftaran_id" INTEGER REFERENCES "pendaftaran"(id),
    "surat_laporan_path" VARCHAR(255),
    "fc_rekening_path" VARCHAR(255),
    "bukti_pengeluaran_path" VARCHAR(255),
    "is_complete" BOOLEAN DEFAULT FALSE,
    "status_verifikasi" "enum_laporan_status_verifikasi" DEFAULT 'pending',
    "catatan_revisi" TEXT,
    "submitted_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
-- Password is bcrypt hash for 'admin123'
INSERT INTO "users" (email, password, role) VALUES ('admin@mace.go.id', '$2b$10$7qB2T8.6nC8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8', 'admin');

-- Password is bcrypt hash for 'student123'
INSERT INTO "users" (email, password, role) VALUES ('john@gmail.com', '$2b$10$7qB2T8.6nC8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8Y7.8', 'mahasiswa');

INSERT INTO "mahasiswa" (user_id, nim, nik, nama_lengkap, alamat_domisili, alamat_ktp, nama_orang_tua) 
VALUES (2, '2021001', '9101010101010001', 'John Doe Papua', 'Jayapura', 'Jayapura', 'Bapak John');

INSERT INTO "pendaftaran" (mahasiswa_id, program, status) VALUES (1, 'A', 'submitted');
