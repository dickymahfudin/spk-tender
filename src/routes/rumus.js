const express = require('express');
const router = express.Router();
const hitung = require('../helpers/hitung');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const { kriteria, link, vendor } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const locations = await link.getAll({ user_id });
  const kriterias = await kriteria.getAll(user_id);

  const tempData = group(locations, 'vendor_id');
  const datas = dataFormat(tempData);
  const hitungs = hitung(datas, kriterias);
  const moora = hitungs.moora;
  const waspas = hitungs.waspas;
  res.render('rumus', { title: 'Rumus', moora, waspas });
});

router.get('/hitung', async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const locations = await link.getAll({ user_id });
    const kriterias = await kriteria.getAll(user_id);

    const tempData = group(locations, 'vendor_id');
    const datas = dataFormat(tempData);
    const hitungs = hitung(datas, kriterias);
    if (hitungs.db.length != 0) {
      hitungs.db.forEach(async db => {
        await vendor.update({ moora: db.y, waspas: db.q }, { where: { id: db.id } });
      });
      req.flash('success', 'Perhitungan Berhasil');
      return res.redirect('/rumus');
    }
    req.flash('error', 'Perhitungan Gagal Data Vendor Tidak Boleh Kosong');
    return res.redirect('/rumus');
  } catch (error) {
    req.flash('error', 'Perhitungan Gagal Minimal 2 Data vendor dan 2 Data kriteria');
    return res.redirect('/rumus');
  }
});

router.get('/json', async (req, res, next) => {
  const user_id = req.session.userId;
  const locations = await link.getAll({ user_id });
  const kriterias = await kriteria.getAll(user_id);

  const tempData = group(locations, 'vendor_id');
  const datas = dataFormat(tempData);
  const hitungs = hitung(datas, kriterias);
  res.json(hitungs);
});
module.exports = router;
