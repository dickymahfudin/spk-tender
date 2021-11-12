const express = require('express');
const router = express.Router();
const group = require('../helpers/group');
const jsonToTable = require('../helpers/jsonToTable');
const dataFormat = require('../helpers/dataFormat');
const { vendor, kriteria, link } = require('../models');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  const kriterias = await kriteria.getAll();
  return res.render('vendor/index', { title: 'Vendor', username, kriterias });
});

router.get('/table', async (req, res, next) => {
  const locations = await link.getAll();
  const tempData = group(locations, 'vendor_id');
  const data = dataFormat(tempData);
  return res.status(200).json(jsonToTable(data));
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  const tempLocation = await vendor.findOne({
    where: {
      name: data.name,
    },
  });
  if (tempLocation) {
    req.flash('error', 'Nama Lokasi Tidak Boleh Sama');
    return res.redirect('/vendor');
  }
  const location = await vendor.create({ name: data.name, alamat: data.alamat, contact: data.contact });
  for (const value of Object.keys(data)) {
    if (value != 'name' && value != 'alamat' && value != 'contact') {
      await link.create({
        kriteria_id: value,
        vendor_id: location.id,
        value: data[value],
      });
    }
  }
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/vendor');
});

router.post('/:id', async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  const tempVendor = await vendor.findOne();
  if (tempVendor) {
    tempVendor.update({ name: data.name });
  }
  for (const value of Object.keys(data)) {
    if (value != 'name') {
      await link.update(
        {
          kriteria_id: value,
          vendor_id: tempVendor.id,
          value: data[value],
        },
        {
          where: {
            kriteria_id: value,
            vendor_id: tempVendor.id,
          },
        }
      );
    }
  }
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/vendor');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempLocation = await vendor.findByPk(id);
  await tempLocation.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/vendor');
});

router.get('/form', async (req, res, next) => {
  const forms = await kriteria.getAll();
  return res.render('vendor/form', {
    action: '/vendor',
    forms,
    name: '',
    title: 'vendor',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const { id } = req.params;
  const kriterias = await kriteria.getAll();
  const tempForms = await link.getAll({ vendor_id: id });
  const name = tempForms[0]['vendor']['name'];
  const forms = kriterias.map(kriteria => {
    const passkriteria = kriteria.dataValues;
    const find = tempForms.find(asli => asli.kriteria_id == kriteria.id) || '';
    return { ...passkriteria, value: find.value };
  });
  return res.render('vendor/form', {
    action: `/vendor/${id}`,
    forms,
    name,
    title: 'Vendor',
  });
});

module.exports = router;
