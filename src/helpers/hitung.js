const hitung = (dataVendor, kriteria) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const moora = datas => {
    const sumPow = (arr, param, kriteria) => {
      const matrix = arr.map(val => val[param]);
      const sum = +Math.sqrt(matrix.reduce((acc, val) => acc + Math.pow(val, 2), 0)).toFixed(3);
      const perhitungan1 = matrix.map(val => +(val / sum).toFixed(3));
      console.log(perhitungan1);
      const alternatif = perhitungan1.map(val => +(val * kriteria.bobot).toFixed(3));
      const alternatifKriteria = alternatif.map(e => {
        return { kriteria: param, value: e, jenis: kriteria.jenis };
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
      return matrix.join('&');
    });
    const y = dataResult.map(e => {
      const benefit = e
        .filter(el => el.jenis === 1)
        .map(mp => mp.value)
        .reduce(reducer);
      const cost = e.filter(el => el.jenis === 0) || 0;
      if (cost.length === 0) {
        const sum = +benefit;
        return +sum.toFixed(3);
      }
      const sum = +(benefit - cost[0].value);
      return +sum.toFixed(3);
    });

    const hasil = y.map((val, i) => {
      const lokasi = datas[i];
      return { id: lokasi.id, a: `A${i + 1}`, name: lokasi.vendor, y: val };
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
      const q = +(q1 + q2).toFixed(3);
      return { id: lokasi.id, a: `A${i + 1}`, name: lokasi.vendor, q1, q2, q };
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
    return { ...el, ...waspas };
  });
  return { moora: hasilMoora, waspas: hasilWaspas, db };
};

module.exports = hitung;
