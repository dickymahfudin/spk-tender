const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { vendor, kriteria, user } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const status = (await user.findByPk(user_id)).status;
  const vendors = await vendor.findAll({
    where: { user_id },
    order: [['id', 'DESC']],
  });
  const kriterias = await kriteria.findAll({ where: { user_id } });
  const vendorValue = vendors.map(e => e.dataValues);
  const moora = [...vendorValue].sort((a, b) => b.moora - a.moora);
  const waspas = [...vendorValue].sort((a, b) => b.waspas - a.waspas);
  res.render('dashboard', { title: 'Dashboard', status, kriterias, moora, waspas });
});

module.exports = router;
