const { Pengguna } = require('../models/PenggunaModel');
const { Role } = require('../models/RoleModel');
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
        role_name: 'Admin'
    },
    {
        id_pengguna: '137111',
        username: 'petugas',
        password: 'petugas123',
        nama_lengkap: 'Dodo Baik',
        email: 'petugas@gmail.com',
        alamat: 'Jl. Veteran No. 1, Padang',
        foto: null,
        nomor_hp: '081234567891',
        role_name: 'Petugas'
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
        role_name: 'Mahasiswa'
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
        role_name: 'Mahasiswa'
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
        role_name: 'Mahasiswa'
    }
];

async function seedPengguna() {
    try {
        // Hapus data yang ada 
        await Pengguna.destroy({ where: {} });
        
        // Get role mappings using raw query to be sure
        const roles = await Role.findAll({
            attributes: ['id_role', 'nama_role']
        });
        
        const roleMap = {};
        roles.forEach(role => {
            roleMap[role.nama_role] = role.id_role;
        });
        
        console.log('Role mappings:', roleMap);
        
        // If roles are not found, use default IDs (assuming they were created in order)
        if (!roleMap['Admin']) {
            console.log('Using default role IDs...');
            roleMap['Admin'] = 1;
            roleMap['Petugas'] = 2;
            roleMap['Mahasiswa'] = 3;
        }
        
        for (const pengguna of penggunaData) {
            const hashedPassword = await hashPassword(pengguna.password);
            const roleId = roleMap[pengguna.role_name];
            
            if (!roleId) {
                throw new Error(`Role '${pengguna.role_name}' not found in database`);
            }
            
            await Pengguna.create({
                id_pengguna: pengguna.id_pengguna,
                username: pengguna.username,
                password: hashedPassword,
                nama_lengkap: pengguna.nama_lengkap,
                email: pengguna.email,
                alamat: pengguna.alamat,
                foto: pengguna.foto,
                nomor_hp: pengguna.nomor_hp,
                id_role: roleId
            });
        }
        
        console.log('Pengguna berhasil di-seed!');
        console.log('Informasi login:');
        console.log('   Admin: email=admin@gmail.com, password=admin123');
        console.log('   Petugas: email=petugas@gmail.com, password=petugas123');
        console.log('   Mahasiswa: email=mahasiswa1@student.unand.ac.id, password=mahasiswa123');
    } catch (error) {
        console.error('Error seeding pengguna:', error);
        throw error;
    }
}

module.exports = seedPengguna; 