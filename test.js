const dataVendor = [
  {
    id: 1,
    name: 'Telkomsel',
    'Kualitas layanan': 90,
    'Harga Penawaran': 50,
    'Kemampuan Pendanaan': 80,
    Kredibilitas: 90,
    Pengalaman: 90,
    'Kelengkapan Legalitas': 90,
  },
  {
    id: 2,
    name: 'Indosat',
    'Kualitas layanan': 80,
    'Harga Penawaran': 60,
    'Kemampuan Pendanaan': 80,
    Kredibilitas: 80,
    Pengalaman: 90,
    'Kelengkapan Legalitas': 80,
  },
  {
    id: 3,
    name: '3 Hutchinson',
    'Kualitas layanan': 70,
    'Harga Penawaran': 90,
    'Kemampuan Pendanaan': 70,
    Kredibilitas: 80,
    Pengalaman: 60,
    'Kelengkapan Legalitas': 80,
  },
  {
    id: 4,
    name: 'AXIS',
    'Kualitas layanan': 70,
    'Harga Penawaran': 70,
    'Kemampuan Pendanaan': 70,
    Kredibilitas: 80,
    Pengalaman: 60,
    'Kelengkapan Legalitas': 60,
  },
  {
    id: 5,
    name: 'XL Axiata',
    'Kualitas layanan': 80,
    'Harga Penawaran': 70,
    'Kemampuan Pendanaan': 90,
    Kredibilitas: 90,
    Pengalaman: 90,
    'Kelengkapan Legalitas': 90,
  },
  {
    id: 6,
    name: 'Smartfren',
    'Kualitas layanan': 60,
    'Harga Penawaran': 90,
    'Kemampuan Pendanaan': 60,
    Kredibilitas: 70,
    Pengalaman: 60,
    'Kelengkapan Legalitas': 90,
  },
  {
    id: 7,
    name: 'PSN',
    'Kualitas layanan': 60,
    'Harga Penawaran': 70,
    'Kemampuan Pendanaan': 60,
    Kredibilitas: 60,
    Pengalaman: 90,
    'Kelengkapan Legalitas': 90,
  },
];

const dataKriteria = [
  { name: 'Kualitas layanan', bobot: 0.4, jenis: 1 },
  { name: 'Harga Penawaran', bobot: 0.23, jenis: 0 },
  { name: 'Kemampuan Pendanaan', bobot: 0.15, jenis: 1 },
  { name: 'Kredibilitas', bobot: 0.1, jenis: 1 },
  { name: 'Pengalaman', bobot: 0.07, jenis: 1 },
  { name: 'Kelengkapan Legalitas', bobot: 0.05, jenis: 1 },
];

const hitung = (dataVendor, kriteria) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const moora = datas => {
    const sumPow = (arr, param, kriteria) => {
      const matrix = arr.map(val => val[param]);
      const sum = +Math.sqrt(matrix.reduce((acc, val) => acc + Math.pow(val, 2), 0)).toFixed(3);
      const perhitungan1 = matrix.map(val => +(val / sum).toFixed(3));
      const alternatif = perhitungan1.map(val => {
        return { array: +(val * kriteria.bobot).toFixed(3), latex: `(${val}*${kriteria.bobot})` };
      });
      const alternatifKriteria = alternatif.map(e => {
        return { kriteria: param, value: e.array, bobot: kriteria.bobot, jenis: kriteria.jenis };
      });
      return {
        matrixString: matrix.join('^2+'),
        matrix,
        sum,
        perhitungan1,
        alternatif,
        alternatifKriteria,
      };
    };

    const data = datas.map(data => {
      const array = Object.values(data);
      return array.slice(2, array.length);
    });
    const matrix1 = data.map(matrix => {
      return matrix.join('&');
    });
    const matrixD = kriteria.map(kriteria => {
      return sumPow(datas, kriteria.name, kriteria);
    });

    const lengthI = matrixD[0].alternatif.length;
    const lengthJ = matrixD.length;
    const newMatrixalternatif = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));
    const dataResult = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));
    const newMatrixPerhitungan1 = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));
    matrixD.forEach((el, i) => {
      el.alternatif.forEach((element, j) => {
        newMatrixalternatif[j][i] = element;
      });
      el.perhitungan1.forEach((element, j) => {
        newMatrixPerhitungan1[j][i] = element;
      });
      el.alternatifKriteria.forEach((element, j) => {
        dataResult[j][i] = element;
      });
    });
    const matrix2 = newMatrixPerhitungan1.map(matrix => {
      return matrix.join('&');
    });
    const matrix3 = newMatrixalternatif.map(matrix => {
      const alternatif = matrix.map(e => e.array).join('&');
      const latex = matrix.map(e => e.latex).join('+');
      return { alternatif, latex };
    });
    const y = dataResult.map(e => {
      const benefit = e
        .filter(el => el.jenis === 1)
        .map(mp => mp.value)
        .reduce(reducer);
      const cost = e.filter(el => el.jenis === 0);
      const sum = +(benefit - cost[0].value);
      return +sum.toFixed(3);
    });

    const hasil = y.map((val, i) => {
      const lokasi = datas[i];
      return { id: lokasi.id, a1: `A${i + 1}`, name: lokasi.name, y: val };
    });
    hasil.sort((a, b) => b.y - a.y);
    return {
      matrix1: matrix1.join('\\\\'),
      matrix2: matrix2.join('\\\\'),
      matrix3: matrix3.join('\\\\'),
      perhitungan: matrixD,
      hasil,
    };
  };

  const waspas = datas => {
    const resultNormalisasi = (arr, kriteria) => {
      const param = kriteria.name;
      const bobot = kriteria.bobot;
      const matrix = arr.map(val => val[param]);
      const sumbuX = kriteria.jenis === 1 ? Math.max(...matrix) : Math.min(...matrix);
      const normalisasi = matrix.map(x => +(x / sumbuX).toFixed(3));
      const q = normalisasi.map(e => {
        const q1 = +(e * bobot).toFixed(3);
        const q2 = +Math.pow(e, bobot).toFixed(3);
        return { q1, q2 };
      });
      return { matrix, sumbuX, normalisasi, q };
    };
    const data = datas.map(data => {
      const array = Object.values(data);
      return array.slice(2, array.length);
    });
    const matrix1 = data.map(matrix => {
      return matrix.join('&');
    });
    const matrixD = kriteria.map(kriteria => {
      return resultNormalisasi(datas, kriteria);
    });
    const lengthI = matrixD[0].normalisasi.length;
    const lengthJ = matrixD.length;
    const newMatrix2 = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));
    const newMatrixQ = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));

    matrixD.forEach((el, i) => {
      el.normalisasi.forEach((element, j) => {
        newMatrix2[j][i] = element;
      });
      el.q.forEach((element, j) => {
        newMatrixQ[j][i] = element;
      });
    });
    const matrix2 = newMatrix2.map(matrix => {
      return matrix.join('&');
    });
    const hasil = newMatrixQ.map((matrix, i) => {
      const lokasi = datas[i];
      const q1 = +(0.5 * matrix.map(e => e.q1).reduce(reducer)).toFixed(3);
      const q2 = +(0.5 * matrix.map(e => e.q2).reduce(reducer)).toFixed(3);
      const q = q1 + q2;
      return { id: lokasi.id, name: lokasi.name, q1, q2, q };
    });
    hasil.sort((a, b) => b.q - a.q);
    return {
      matrix1: matrix1.join('\\\\'),
      matrix2: matrix2.join('\\\\'),
      perhitungan: matrixD,
      hasil,
    };
  };
  const hasilMoora = moora(dataVendor);
  const hasilWaspas = waspas(dataVendor);
  const db = hasilMoora.hasil.map(el => {
    const waspas = hasilWaspas.hasil.find(e => e.id == el.id);
    console.log(waspas);
    return { ...el, ...waspas };
  });
  return { moora: hasilMoora, waspas: hasilWaspas, db };
};

console.log(hitung(dataVendor, dataKriteria));
