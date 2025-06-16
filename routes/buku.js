const express = require('express');
const router = express.Router();

router.get('/', bukuController.showAll);
router.get('/tambah', bukuController.showForm);
router.post('/tambah', bukuController.create);

module.exports = router;
