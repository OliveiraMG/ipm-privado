/**
 * Serviço para gerenciar dados dos municípios
 */

// Constantes
const API_BASE_URL = '/api/v1';
const USE_MOCK_DATA = true; // Para ambiente de desenvolvimento

// Função para criar séries temporais (evita repetição)
const createTimeSeries = (startYear = 2013, endYear = 2024) => {
  // Template para indicadores
  const indicatorTemplate = {
    2013: { iva: 3.5, educacao: 2.8, saude: 1.9, ucti: 2.5, trib_propria: 0.8, populacao: 1.2, area: 3.0, indice_final: 1.4 },
    2014: { iva: 3.7, educacao: 3.0, saude: 2.1, ucti: 2.7, trib_propria: 1.0, populacao: 1.2, area: 3.0, indice_final: 1.5 },
    2015: { iva: 4.2, educacao: 3.5, saude: 2.3, ucti: 3.0, trib_propria: 1.2, populacao: 1.3, area: 3.0, indice_final: 1.7 },
    2016: { iva: 3.8, educacao: 3.2, saude: 2.0, ucti: 2.8, trib_propria: 1.1, populacao: 1.3, area: 3.0, indice_final: 1.6 },
    2017: { iva: 4.0, educacao: 3.4, saude: 2.2, ucti: 2.9, trib_propria: 1.2, populacao: 1.4, area: 3.0, indice_final: 1.7 },
    2018: { iva: 4.1, educacao: 3.5, saude: 2.3, ucti: 3.0, trib_propria: 1.3, populacao: 1.4, area: 3.0, indice_final: 1.8 },
    2019: { iva: 4.2, educacao: 3.6, saude: 2.4, ucti: 3.1, trib_propria: 1.3, populacao: 1.5, area: 3.0, indice_final: 1.8 },
    2020: { iva: 4.0, educacao: 3.5, saude: 2.3, ucti: 3.0, trib_propria: 1.2, populacao: 1.5, area: 3.0, indice_final: 1.8 },
    2021: { iva: 3.9, educacao: 3.4, saude: 2.2, ucti: 2.9, trib_propria: 1.2, populacao: 1.4, area: 3.0, indice_final: 1.7 },
    2022: { iva: 4.1, educacao: 3.5, saude: 2.3, ucti: 3.0, trib_propria: 1.3, populacao: 1.5, area: 3.0, indice_final: 1.8 },
    2023: { iva: 3.8, educacao: 3.3, saude: 2.1, ucti: 2.8, trib_propria: 1.1, populacao: 1.4, area: 3.0, indice_final: 1.7 },
    2024: { iva: 4.0, educacao: 3.5, saude: 2.2, ucti: 3.0, trib_propria: 1.2, populacao: 1.5, area: 3.0, indice_final: 1.8 }
  };

  // Template para repasses
  const repassesTemplate = {
    2013: { iva: 7450000, educacao: 3200000, saude: 980000, ucti: 1450000, trib_propria: 450000, populacao: 680000, area: 320000, indice_final: 450000 },
    2014: { iva: 8200000, educacao: 3600000, saude: 1050000, ucti: 1600000, trib_propria: 520000, populacao: 720000, area: 340000, indice_final: 480000 },
    2015: { iva: 9800000, educacao: 4100000, saude: 1200000, ucti: 1850000, trib_propria: 580000, populacao: 780000, area: 360000, indice_final: 520000 },
    2016: { iva: 9200000, educacao: 3900000, saude: 1150000, ucti: 1750000, trib_propria: 560000, populacao: 740000, area: 350000, indice_final: 510000 },
    2017: { iva: 10000000, educacao: 4300000, saude: 1300000, ucti: 2000000, trib_propria: 600000, populacao: 800000, area: 370000, indice_final: 550000 },
    2018: { iva: 10500000, educacao: 4600000, saude: 1350000, ucti: 2100000, trib_propria: 620000, populacao: 820000, area: 380000, indice_final: 570000 },
    2019: { iva: 11000000, educacao: 4900000, saude: 1400000, ucti: 2200000, trib_propria: 640000, populacao: 840000, area: 390000, indice_final: 590000 },
    2020: { iva: 10800000, educacao: 4800000, saude: 1380000, ucti: 2150000, trib_propria: 630000, populacao: 830000, area: 385000, indice_final: 580000 },
    2021: { iva: 10600000, educacao: 4700000, saude: 1360000, ucti: 2100000, trib_propria: 620000, populacao: 820000, area: 380000, indice_final: 570000 },
    2022: { iva: 10800000, educacao: 4900000, saude: 1400000, ucti: 2200000, trib_propria: 640000, populacao: 840000, area: 390000, indice_final: 590000 },
    2023: { iva: 11000000, educacao: 5000000, saude: 1450000, ucti: 2300000, trib_propria: 650000, populacao: 850000, area: 400000, indice_final: 600000 },
    2024: { iva: 11500000, educacao: 5200000, saude: 1500000, ucti: 2400000, trib_propria: 670000, populacao: 870000, area: 410000, indice_final: 620000 }
  };

  // Converter para o formato de série temporal
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
  return {
    indicadores: years.map(ano => ({ 
      ano,
      ...indicatorTemplate[ano] 
    })),
    repasses: years.map(ano => ({ 
      ano,
      ...repassesTemplate[ano] 
    }))
  };
};

// Dados mockados para desenvolvimento
const MOCK_DATA = {
  'Pontes e Lacerda': {
    contribuintes: {
      total: { valor: 15294, mei: 469, simplesNacional: 0, simplificado: 0 },
      baixados: { valor: 7691, mei: 469, simplesNacional: 0, simplificado: 0 },
      ativos: { valor: 6498, mei: 2701, simplesNacional: 0, simplificado: 0 },
      suspensos: { valor: 1105, mei: 24, simplesNacional: 0, simplificado: 0 }
    },
    repasses: {
      ano: 2023,
      indice: 58427988.13,
      iva: 65295127.94,
      educacao: 105459035.22,
      saude: 98350.0,
      ucti: 135748944.74,
      trib_propria: 75719667.0,
      populacao: 48750875.25,
      area: 93.5,
      coef_local: 312701.99
    },
    indices: [
      { exercicio: 2023, municipio: 'Pontes e Lacerda', vaf: 2475495068.34, variacao: '+16.21%', rank: 22 },
      { exercicio: 2022, municipio: 'Pontes e Lacerda', vaf: 2130774160.22, variacao: '+12.53%', rank: 25 },
      { exercicio: 2021, municipio: 'Pontes e Lacerda', vaf: 1893394687.48, variacao: '+70.51%', rank: 17 },
      { exercicio: 2020, municipio: 'Pontes e Lacerda', vaf: 1109862919.70, variacao: '+10.99%', rank: 20 }
    ],
    execucao: [
      { exercicio: 2023, municipio: 'Pontes e Lacerda', vaf: 2371566.34, variacao: '-16.23%', rank: 22 },
      { exercicio: 2022, municipio: 'Pontes e Lacerda', vaf: 2809009.24, variacao: '+42.30%', rank: 20 },
      { exercicio: 2021, municipio: 'Pontes e Lacerda', vaf: 1975381.96, variacao: '+19.51%', rank: 17 },
      { exercicio: 2020, municipio: 'Pontes e Lacerda', vaf: 1652462.18, variacao: '+15.98%', rank: 20 }
    ],
    vaf: [
      { ano: 2020, vaf_anterior: 1109862.91970, vaf_atual: 850000.00 },
      { ano: 2021, vaf_anterior: 1893394.68748, vaf_atual: 1300000.00 },
      { ano: 2022, vaf_anterior: 2130774.16022, vaf_atual: 2800000.00 },
      { ano: 2023, vaf_anterior: 2475495.06834, vaf_atual: 2000000.00 },
      { ano: 2024, vaf_anterior: 2650000.00, vaf_atual: 2300000.00 }
    ],
  },
  'Cuiabá': {
    contribuintes: {
      total: { valor: 42157, mei: 1232, simplesNacional: 324, simplificado: 78 },
      baixados: { valor: 14832, mei: 587, simplesNacional: 120, simplificado: 42 },
      ativos: { valor: 22568, mei: 4215, simplesNacional: 145, simplificado: 36 },
      suspensos: { valor: 4757, mei: 430, simplesNacional: 59, simplificado: 0 }
    },
    repasses: {
      ano: 2023,
      indice: 98427988.13,
      iva: 125295127.94,
      educacao: 205459035.22,
      saude: 298350.0,
      ucti: 235748944.74,
      trib_propria: 95719667.0,
      populacao: 98750875.25,
      area: 193.5,
      coef_local: 812701.99
    },
    indices: [
      { exercicio: 2023, municipio: 'Cuiabá', vaf: 5275495068.34, variacao: '+12.21%', rank: 1 },
      { exercicio: 2022, municipio: 'Cuiabá', vaf: 4700774160.22, variacao: '+8.53%', rank: 1 },
      { exercicio: 2021, municipio: 'Cuiabá', vaf: 4334287458.73, variacao: '+15.21%', rank: 1 },
      { exercicio: 2020, municipio: 'Cuiabá', vaf: 3762102677.81, variacao: '+7.99%', rank: 1 }
    ],
    execucao: [
      { exercicio: 2023, municipio: 'Cuiabá', vaf: 5102566.34, variacao: '+8.21%', rank: 1 },
      { exercicio: 2022, municipio: 'Cuiabá', vaf: 4715089.24, variacao: '+11.30%', rank: 1 },
      { exercicio: 2021, municipio: 'Cuiabá', vaf: 4236581.96, variacao: '+12.51%', rank: 1 },
      { exercicio: 2020, municipio: 'Cuiabá', vaf: 3765462.18, variacao: '+8.48%', rank: 1 }
    ],
    vaf: [
      { ano: 2020, vaf_anterior: 3762102.67781, vaf_atual: 3765462.18 },
      { ano: 2021, vaf_anterior: 4334287.45873, vaf_atual: 4236581.96 },
      { ano: 2022, vaf_anterior: 4700774.16022, vaf_atual: 4715089.24 },
      { ano: 2023, vaf_anterior: 5275495.06834, vaf_atual: 5102566.34 },
      { ano: 2024, vaf_anterior: 5800000.00, vaf_atual: 5600000.00 }
    ],
  }
};

// Adicionar séries temporais aos municípios
Object.keys(MOCK_DATA).forEach(municipio => {
  const series = createTimeSeries();
  MOCK_DATA[municipio].indicadores_serie = series.indicadores;
  MOCK_DATA[municipio].repasses_serie = series.repasses;
});

/**
 * Busca dados de um município específico
 * @param {string} municipalityName - Nome do município
 * @returns {Promise<Object>} - Dados do município
 */
export const getMunicipality = async (municipalityName) => {
  console.log(`Buscando dados do município: ${municipalityName}`);

  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = MOCK_DATA[municipalityName];
        if (data) {
          console.log(`Dados encontrados para ${municipalityName}`);
          resolve(data);
        } else {
          reject(new Error(`Município não encontrado: ${municipalityName}`));
        }
      }, 300); // Simular tempo de resposta
    });
  }

  try {
    const url = `${API_BASE_URL}/municipios/${encodeURIComponent(municipalityName)}`;
    console.log(`Fazendo requisição para API: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar município: ${response.statusText}`);
    
    const data = await response.json();
    console.log(`Dados recebidos da API para ${municipalityName}`);
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

/**
 * Busca lista de municípios disponíveis
 * @returns {Promise<Array<string>>} - Lista de municípios
 */
export const getMunicipalities = async () => {
  console.log('Buscando lista de municípios');

  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        const municipalities = Object.keys(MOCK_DATA);
        console.log(`${municipalities.length} municípios encontrados (mock)`);
        resolve(municipalities);
      }, 200);
    });
  }

  try {
    const url = `${API_BASE_URL}/municipios`;
    console.log(`Fazendo requisição para API: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar municípios: ${response.statusText}`);
    
    const data = await response.json();
    console.log(`${data.length} municípios recebidos da API`);
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};