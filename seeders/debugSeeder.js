const { Role } = require('../models/RoleModel');
const { Pengguna } = require('../models/PenggunaModel');
const sequelize = require('../config/db');

async function debugSeeder() {
    try {
        console.log('=== DEBUG SEEDER ===');
        
        // Test database connection
        console.log('1. Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check if tables exist
        console.log('\n2. Checking if tables exist...');
        const tables = await sequelize.showAllSchemas();
        console.log('Available tables:', tables);
        
        // Check Role table
        console.log('\n3. Checking Role table...');
        const roleCount = await Role.count();
        console.log(`Role table has ${roleCount} records`);
        
        if (roleCount > 0) {
            const roles = await Role.findAll();
            console.log('Existing roles:', roles.map(r => `${r.nama_role} (ID: ${r.id_role})`));
        }
        
        // Check Pengguna table
        console.log('\n4. Checking Pengguna table...');
        const penggunaCount = await Pengguna.count();
        console.log(`Pengguna table has ${penggunaCount} records`);
        
        // Test creating a role
        console.log('\n5. Testing role creation...');
        const testRole = await Role.create({ nama_role: 'TestRole' });
        console.log(`Created test role: ${testRole.nama_role} with ID: ${testRole.id_role}`);
        
        // Clean up test role
        await testRole.destroy();
        console.log('Test role cleaned up');
        
        console.log('\n✅ Debug completed successfully');
        
    } catch (error) {
        console.error('❌ Debug error:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        await sequelize.close();
    }
}

if (require.main === module) {
    debugSeeder();
}

module.exports = debugSeeder; 