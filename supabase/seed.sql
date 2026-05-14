-- 1. Pembuatan Tipe ENUM (Gunakan DO block agar tidak error jika sudah ada)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
        CREATE TYPE "enum_users_role" AS ENUM('mahasiswa', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pendaftaran_program') THEN
        CREATE TYPE "enum_pendaftaran_program" AS ENUM('A', 'B', 'C', 'D', 'E');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pendaftaran_status') THEN
        CREATE TYPE "enum_pendaftaran_status" AS ENUM('draft', 'submitted', 'lolos_berkas', 'ditolak', 'selesai', 'revisi');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_dokumen_pendaftaran_jenis_dokumen') THEN
        CREATE TYPE "enum_dokumen_pendaftaran_jenis_dokumen" AS ENUM('surat_permohonan', 'rab', 'kartu_mahasiswa', 'ktp', 'sk_aktif', 'khs', 'kartu_keluarga', 'pasfoto', 'rekening');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_laporan_status_verifikasi') THEN
        CREATE TYPE "enum_laporan_status_verifikasi" AS ENUM('pending', 'verified', 'revisi');
    END IF;
END $$;

-- 2. Pembuatan Tabel Utama
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" "enum_users_role" DEFAULT 'mahasiswa',
    "is_approved" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "mahasiswa" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
    "nim" VARCHAR(255) NOT NULL UNIQUE,
    "nik" VARCHAR(255) NOT NULL UNIQUE,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(255),
    "alamat_domisili" TEXT,
    "alamat_ktp" TEXT,
    "nama_orang_tua" VARCHAR(255),
    "perguruan_tinggi" VARCHAR(255),
    "program_studi" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "pendidikan" (
    "id" SERIAL PRIMARY KEY,
    "mahasiswa_id" INTEGER REFERENCES "mahasiswa"(id) ON DELETE CASCADE,
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
    "mahasiswa_id" INTEGER REFERENCES "mahasiswa"(id) ON DELETE CASCADE,
    "program" "enum_pendaftaran_program" NOT NULL,
    "status" "enum_pendaftaran_status" DEFAULT 'submitted',
    "alasan_penolakan" TEXT,
    "kode_kartu" VARCHAR(255) UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "dokumen_pendaftaran" (
    "id" SERIAL PRIMARY KEY,
    "pendaftaran_id" INTEGER REFERENCES "pendaftaran"(id) ON DELETE CASCADE,
    "jenis_dokumen" "enum_dokumen_pendaftaran_jenis_dokumen" NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "uploaded_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "laporan" (
    "id" SERIAL PRIMARY KEY,
    "pendaftaran_id" INTEGER REFERENCES "pendaftaran"(id) ON DELETE CASCADE,
    "surat_laporan_path" VARCHAR(255),
    "fc_rekening_path" VARCHAR(255),
    "bukti_pengeluaran_path" VARCHAR(255),
    "is_complete" BOOLEAN DEFAULT FALSE,
    "status_verifikasi" "enum_laporan_status_verifikasi" DEFAULT 'pending',
    "catatan_revisi" TEXT,
    "submitted_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Data (Menggunakan ON CONFLICT agar tidak error jika dijalankan ulang)
-- Admin Account (is_approved harus TRUE)
INSERT INTO "users" (email, password, role, is_approved) 
VALUES ('admin@mace.go.id', '$2a$10$vI8tmZH.AYVTrJ3BeWqRAux6Ka/8mp1icjHEwVG69.S8m.C94DGl.', 'admin', true)
ON CONFLICT (email) DO UPDATE SET is_approved = true, role = 'admin', password = EXCLUDED.password;

-- User John
INSERT INTO "users" (email, password, role, is_approved) 
VALUES ('john@gmail.com', '$2a$10$vI8tmZH.AYVTrJ3BeWqRAux6Ka/8mp1icjHEwVG69.S8m.C94DGl.', 'mahasiswa', true)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- User Faizal (Data Collector)
INSERT INTO "users" (email, password, role, is_approved) 
VALUES ('faizal@gmail.com', '$2a$10$vI8tmZH.AYVTrJ3BeWqRAux6Ka/8mp1icjHEwVG69.S8m.C94DGl.', 'mahasiswa', true)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- 4. Seed Data Mahasiswa (Gunakan subquery untuk mendapatkan ID User yang tepat)
INSERT INTO "mahasiswa" (user_id, nim, nik, nama_lengkap, alamat_domisili, alamat_ktp, nama_orang_tua) 
VALUES (
    (SELECT id FROM "users" WHERE email = 'john@gmail.com'), 
    '2021001', '9101010101010001', 'John Doe Papua', 'Jayapura', 'Jayapura', 'Bapak John'
) ON CONFLICT (nim) DO NOTHING;

INSERT INTO "mahasiswa" (user_id, nim, nik, nama_lengkap, alamat_domisili, alamat_ktp, nama_orang_tua, perguruan_tinggi, program_studi) 
VALUES (
    (SELECT id FROM "users" WHERE email = 'faizal@gmail.com'), 
    '2300018199', '9103012010040003', 'Faizal Putra Ramadhan', 'Jayapura', 'Jayapuran', 'Imam Subekti', 'Universitas Ahmad Dahlan', 'Informatika'
) ON CONFLICT (nim) DO NOTHING;

-- 5. Seed Pendaftaran
INSERT INTO "pendaftaran" (mahasiswa_id, program, status) 
VALUES (
    (SELECT id FROM "mahasiswa" WHERE nim = '2021001'), 
    'A', 'submitted'
) ON CONFLICT DO NOTHING;