const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const { kriteria, link, user } = require('../models');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  return res.render('kriteria/index', { title: 'Kriteria', username });
});

router.get('/table', async (req, res, next) => {
  const user_id = req.session.userId;
  const kriterias = (await kriteria.getAll(user_id)).map(e => {
    const data = e.dataValues;
    const jenis = data.jenis === 0 ? 'Cost' : 'Benefit';
    return { ...data, jenis };
  });
  return res.json(jsonToTable(kriterias));
});

router.post('/', async (req, res, next) => {
  const { name, bobot, jenis } = req.body;
  const user_id = req.session.userId;
  const tempName = await kriteria.findOne({ where: { name, user_id } });

  if (tempName) {
    req.flash('error', 'Nama kriteria Tidak Boleh Sama');
    return res.redirect('/kriteria');
  }
  const create = await kriteria.create({ user_id, name, bobot, jenis: +jenis });
  const tempLink = await link.getAll({ user_id });
  if (tempLink.length != 0) {
    const tempgroup = group(tempLink, 'vendor_id');
    const data = dataFormat(tempgroup);
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const el = data[key];
        await link.create({
          user_id,
          kriteria_id: create.id,
          vendor_id: el.id,
          value: 0,
        });
      }
    }
  }
  await user.update({ status: false }, { where: { id: user_id } });
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/kriteria');
});

router.post('/:id', async (req, res, next) => {
  const { name, bobot, jenis } = req.body;
  const user_id = req.session.userId;
  const id = req.params.id;
  const tempName = await kriteria.findByPk(id);
  await tempName.update({ name, bobot, jenis: +jenis });
  await user.update({ status: false }, { where: { id: user_id } });
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/kriteria');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempkriteria = await kriteria.findByPk(id);
  await tempkriteria.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/kriteria');
});

router.get('/form', async (req, res, next) => {
  const value = { name: '', bobot: '' };
  return res.render('kriteria/form', {
    action: '/kriteria',
    value,
    title: 'Kriteria',
  });
});
router.get('/form/:id', async (req, res, next) => {
  const id = req.params.id;
  const value = await kriteria.findByPk(id);
  return res.render('kriteria/form', {
    action: `/kriteria/${id}`,
    value,
    title: 'Kriteria',
  });
});

module.exports = router;
