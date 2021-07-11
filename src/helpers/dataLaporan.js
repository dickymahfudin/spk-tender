const models = require('../models');

const criterias = async user_id => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const dataKriteria = [
    { user_id, name: 'Kualitas layanan', bobot: 0.4, jenis: 1, createdAt, updatedAt },
    { user_id, name: 'Harga Penawaran', bobot: 0.23, jenis: 0, createdAt, updatedAt },
    { user_id, name: 'Kemampuan Pendanaan', bobot: 0.15, jenis: 1, createdAt, updatedAt },
    { user_id, name: 'Kredibilitas', bobot: 0.1, jenis: 1, createdAt, updatedAt },
    { user_id, name: 'Pengalaman', bobot: 0.07, jenis: 1, createdAt, updatedAt },
    { user_id, name: 'Kelengkapan Legalitas', bobot: 0.05, jenis: 1, createdAt, updatedAt },
  ];

  const dataLocation = [
    { user_id, name: 'Telkomsel', moora: '0.280', waspas: '3.484', createdAt, updatedAt },
    { user_id, name: 'Indosat', moora: '0.240', waspas: '3.465', createdAt, updatedAt },
    { user_id, name: '3 Hutchinson', moora: '0.166', waspas: '3.494', createdAt, updatedAt },
    { user_id, name: 'AXIS', moora: '0.186', waspas: '3.404', createdAt, updatedAt },
    { user_id, name: 'XL Axiata', moora: '0.242', waspas: '3.541', createdAt, updatedAt },
    { user_id, name: 'Smartfren', moora: '0.134', waspas: '3.420', createdAt, updatedAt },
    { user_id, name: 'PSN', moora: '0.164', waspas: '3.353', createdAt, updatedAt },
  ];
  const valueLink = [
    [90, 50, 80, 90, 90, 90],
    [80, 60, 80, 80, 90, 80],
    [70, 90, 70, 80, 60, 80],
    [70, 70, 70, 80, 60, 60],
    [80, 70, 90, 90, 90, 90],
    [60, 90, 60, 70, 60, 90],
    [60, 70, 60, 60, 90, 90],
  ];
  const kriterias = await models.kriteria.bulkCreate(dataKriteria);
  const locations = await models.vendor.bulkCreate(dataLocation);

  for (const i in locations) {
    if (Object.hasOwnProperty.call(locations, i)) {
      const location = locations[i];
      for (const j in kriterias) {
        if (Object.hasOwnProperty.call(kriterias, j)) {
          const criteria = kriterias[j];
          await models.link.create({
            user_id,
            vendor_id: location.id,
            kriteria_id: criteria.id,
            value: valueLink[i][j],
          });
        }
      }
    }
  }
  return { status: 'success' };
};

module.exports = criterias;
