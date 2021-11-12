const models = require('../models');

const criterias = async () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const dataKriteria = [
    { name: 'Kualifikasi', bobot: 0.1, jenis: 1, createdAt, updatedAt },
    { name: 'Pembuktian', bobot: 0.2, jenis: 1, createdAt, updatedAt },
    { name: 'Teknis', bobot: 0.4, jenis: 1, createdAt, updatedAt },
    { name: 'Harga', bobot: 0.3, jenis: 1, createdAt, updatedAt },
  ];

  const dataLocation = [
    { name: 'PT TATA BUMI KONSULTAN', moora: '0.481', waspas: '2.484', createdAt, updatedAt },
    { name: 'MARTHA TRIA SELARAS', moora: '0.448', waspas: '2.414', createdAt, updatedAt },
    { name: 'CV INTISHAR KARYA', moora: '0.468', waspas: '2.459', createdAt, updatedAt },
    { name: 'PT JASA PERENCANA NUSANTARA', moora: '0.462', waspas: '2.446', createdAt, updatedAt },
    { name: 'TIRTA BUANA', moora: '0.305', waspas: '1.79', createdAt, updatedAt },
  ];
  const valueLink = [
    [84.56, 92, 92.03, 94.68],
    [72.11, 77.96, 87.18, 94.68],
    [78.85, 79.36, 90.89, 100],
    [84.95, 78.92, 88.74, 96.57],
    [85.77, 71.78, 88.81, 0],
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
