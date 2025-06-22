const { Role } = require('../models/RoleModel');

const roleData = [
    { nama_role: 'Admin' },
    { nama_role: 'Petugas' },
    { nama_role: 'Mahasiswa' }
];

async function seedRole() {
    try {
        console.log('Starting role seeding...');
        await Role.destroy({ where: {} });
        console.log('Existing roles deleted');
        
        const createdRoles = [];
        for (const role of roleData) {
            const createdRole = await Role.create(role);
            createdRoles.push(createdRole);
            console.log(`Created role: ${createdRole.nama_role} with ID: ${createdRole.id_role}`);
        }
        
        console.log('Role berhasil di-seed!');
        console.log('Created roles:', createdRoles.map(r => `${r.nama_role} (ID: ${r.id_role})`));
    } catch (error) {
        console.error('Error seeding role:', error);
        throw error;
    }
}

module.exports = seedRole; 