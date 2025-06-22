const { Pengguna } = require('../models/PenggunaModel');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const penggunaData = [
    {
        id_pengguna: '001',
        username: 'admin',
        password: 'admin123',
        nama_lengkap: 'Budi Baik',
        email: 'admin@gmail.com',
        alamat: 'Jl. Universitas Andalas, Padang',
        foto: null,
        nomor_hp: '081234567890',
        id_role: 1 
    },
    {
        id_pengguna: '1371118001234',
        username: 'petugas',
        password: 'petugas123',
        nama_lengkap: 'Dodo Baik',
        email: 'petugas@gmail.com',
        alamat: 'Jl. Veteran No. 1, Padang',
        foto: null,
        nomor_hp: '081234567891',
        id_role: 2 
    },
    {
        id_pengguna: '2311521001',
        username: 'mahasiswa1',
        password: 'mahasiswa123',
        nama_lengkap: 'Susi Baik',
        email: 'mahasiswa1@student.unand.ac.id',
        alamat: 'Jl. Hamka No. 1, Padang',
        foto: null,
        nomor_hp: '081234567893',
        id_role: 3 
    },
    {
        id_pengguna: '2311521002',
        username: 'mahasiswa2',
        password: 'mahasiswa123',
        nama_lengkap: 'Dodo Baik',
        email: 'mahasiswa2@student.unand.ac.id',
        alamat: 'Jl. Mahasiswa No. 2, Padang',
        foto: null,
        nomor_hp: '081234567894',
        id_role: 3 
    },
    {
        id_pengguna: '2311521003',
        username: 'mahasiswa3',
        password: 'mahasiswa123',
        nama_lengkap: 'Gogo Baik',
        email: 'mahasiswa3@student.unand.ac.id',
        alamat: 'Jl. Kayu Kalek No. 3, Padang',
        foto: null,
        nomor_hp: '081234567895',
        id_role: 3 
    }
];

async function seedPengguna() {
    try {
        // Hapus data yang ada 
        await Pengguna.destroy({ where: {} });
        
        for (const pengguna of penggunaData) {
            const hashedPassword = await hashPassword(pengguna.password);
            await Pengguna.create({
                ...pengguna,
                password: hashedPassword
            });
        }
        
        console.log('Pengguna berhasil di-seed!');
        console.log('Informasi login:');
        console.log('   Admin: username=admin, password=admin123');
        console.log('   Petugas: username=petugas1/petugas2, password=petugas123');
        console.log('   Mahasiswa: username=mahasiswa1/mahasiswa2/mahasiswa3, password=mahasiswa123');
    } catch (error) {
        console.error('Error seeding pengguna:', error);
        throw error;
    }
}

module.exports = seedPengguna; 