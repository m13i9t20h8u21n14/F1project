const express = require('express');
const router = express.Router();
const { listSeasons, listSessions, getSession, archiveSession, archiveStatus } = require('../controllers/f1Controller');

router.get('/seasons', listSeasons);
router.get('/sessions', listSessions);
router.get('/session/:id', getSession);
router.post('/archive', archiveSession);
router.get('/archive/status', archiveStatus);

module.exports = router;
