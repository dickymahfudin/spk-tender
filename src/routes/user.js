const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const jsonToTable = require('../helpers/jsonToTable');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const { kriteria, link, user } = require('../models');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res, next) => {
  return res.render('user/index', { title: 'User' });
});

router.get('/table', async (req, res, next) => {
  const users = await user.findAll({
    where: { id: { [Op.ne]: 1 } },
    attributes: { exclude: ['password', 'status', 'role', 'createdAt', 'updatedAt'] },
  });
  return res.json(jsonToTable(users, 'dataValues'));
});

router.post('/', async (req, res, next) => {
  const { username, name } = req.body;
  const tempUser = await user.findOne({ where: { username } });
  if (tempUser) {
    req.flash('error', 'Username Sudah Ada Harap menggunakan Username Yang Lain');
    return res.redirect('/user');
  }
  const password = await bcrypt.hash(req.body.password, 10);
  await user.create({ username, name, password });
  req.flash('success', 'User Berhasil Di tambahkan');
  return res.redirect('/user');
  //   return res.json(jsonToTable(users, 'dataValues'));
});

router.post('/:id', async (req, res, next) => {
  const { username, name } = req.body;
  const password = await bcrypt.hash(req.body.password, 10);
  const tempUser = await user.findOne({ where: { username } });
  await tempUser.update({ username, name, password });
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/user');
});

router.get('/form', async (req, res, next) => {
  const value = { name: '', username: '', password: '' };
  return res.render('user/form', {
    action: '/user',
    value,
    title: 'Users',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const id = req.params.id;
  const findUser = await user.findByPk(id);
  findUser.password = '';
  return res.render('user/form', {
    action: '/user/id',
    value: findUser,
    title: 'Users',
  });
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempUser = await user.findByPk(id);
  await tempUser.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/user');
});
module.exports = router;
