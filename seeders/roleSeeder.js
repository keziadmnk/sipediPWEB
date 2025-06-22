const { Role } = require('../models/RoleModel');

const roleData = [
    { nama_role: 'Admin' },
    { nama_role: 'Petugas' },
    { nama_role: 'Mahasiswa' }
];

async function seedRole() {
    try {
        await Role.destroy({ where: {} });
        
        for (const role of roleData) {
            await Role.create(role);
        }
        
        console.log('Role berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding role:', error);
        throw error;
    }
}

module.exports = seedRole; 