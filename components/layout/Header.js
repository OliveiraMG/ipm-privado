/**
 * Header Component - Main navigation header for IPM-e
 */

import HeaderDropdown from '../layout/HeaderDropdown.js';

class Header {
  constructor() {
    // Não precisa de parâmetros por enquanto
    this.dropdowns = [];
  }

  render() {
    return `
      <div class="w-full bg-white">
        <!-- Logo and Notification Section -->
        <div class="flex justify-between items-center pt-8 pb-6 px-16">
          <h1 class="text-5xl font-bold text-blue-dark ml-8">IPM-e</h1>
          <div class="flex items-center">
            <button aria-label="Notificações" class="text-gray-500 hover:text-gray-700">
              <i class="fa-regular fa-bell text-xl"></i>
            </button>
          </div>
        </div>
        
        <!-- Main Navigation -->
        <div class="mx-10 mb-6">
          <div class="flex justify-center">
            <ul class="flex items-center space-x-12 py-3">
              <li>
                <a href="#" id="nav-dashboard" class="block bg-blue-light text-white py-2 px-6 rounded-full w-48 text-center" aria-current="page">
                  <i class="fa-solid fa-gauge-high mr-2"></i>
                  <span class="text-xl font-medium">Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-importacao" class="block hover:text-blue-light">
                  <i class="fa-solid fa-file-import mr-2"></i>
                  <span class="text-base">Importação</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-gerenciar" class="block hover:text-blue-light">
                  <i class="fa-solid fa-gears mr-2"></i>
                  <span class="text-base">Gerenciar</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-cadastro" class="block hover:text-blue-light">
                  <i class="fa-solid fa-list-check mr-2"></i>
                  <span class="text-base">Cadastro</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-relatorios" class="block hover:text-blue-light">
                  <i class="fa-solid fa-file-lines mr-2"></i>
                  <span class="text-base">Relatórios</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-auxiliares" class="block hover:text-blue-light">
                  <i class="fa-solid fa-circle-info mr-2"></i>
                  <span class="text-base">Auxiliares</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" id="nav-acessos" class="block hover:text-blue-light">
                  <i class="fa-solid fa-lock mr-2"></i>
                  <span class="text-base">Acessos</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Submenu/Breadcrumb - Com espaçamento reduzido -->
        <div class="w-full bg-[#D9D9D9]" role="navigation" aria-label="Breadcrumb">
          <div class="pt-1 pb-1 pl-20 pr-16">
            <div class="text-gray-500 text-base leading-tight">Dashboard |</div>
            <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Dashboard</div>
          </div>
        </div>
      </div>
    `;
  }

  // Método para inicializar os dropdowns
  setupDropdowns() {
    // Dropdown para Gerenciar (Malha Fiscal, Monitoramento, Estatísticas, ICMS Cota Parte)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-gerenciar'),
        categories: [
          { id: 'malha-fiscal', title: 'Malha Fiscal' },
          { id: 'monitoramento', title: 'Monitoramento' },
          { id: 'estatisticas', title: 'Estatísticas' },
          { id: 'icms-cota-parte', title: 'ICMS Cota Parte' }
        ],
        items: [
          // Malha Fiscal
          { title: 'NOTIFICAR', icon: 'user-shield', url: '/notificar', category: 'malha-fiscal' },
          { title: 'LOTES GERADOS', icon: 'layer-group', url: '/lotes-gerados', category: 'malha-fiscal' },
          { title: 'DISPARO DE NOTIFICAÇÕES', icon: 'paper-plane', url: '/disparo-notificacoes', category: 'malha-fiscal' },
          { title: 'NOTIFICAÇÃO AVULSA', icon: 'envelope', url: '/notificacao-avulsa', category: 'malha-fiscal' },
          { title: 'MOTIVOS NOTIFICAÇÕES', icon: 'list', url: '/motivos-notificacoes', category: 'malha-fiscal' },

          // Monitoramento
          { title: 'INCLUSÃO', icon: 'plus-circle', url: '/inclusao', category: 'monitoramento' },

          // Estatísticas
          { title: 'APURAÇÃO', icon: 'calculator', url: '/apuracao', category: 'estatisticas' },
          { title: 'GRÁFICOS', icon: 'chart-line', url: '/graficos', category: 'estatisticas' },
          { title: 'ÍNDICE DO MUNICÍPIO', icon: 'list-ol', url: '/indice-municipio', category: 'estatisticas' },
          { title: 'ÍNDICE ANTERIOR E ATUAL', icon: 'exchange-alt', url: '/indice-anterior-atual', category: 'estatisticas' },
          { title: 'VA,REC. BRUTA,POPULAÇÃO e ÁREA', icon: 'city', url: '/va-rec-bruta', category: 'estatisticas' },
          { title: 'VA POR CAT. ECONÔMICA E OUTROS', icon: 'chart-pie', url: '/va-cat-economica', category: 'estatisticas' },

          // ICMS Cota Parte
          { title: 'ESTADUAL', icon: 'building-government', url: '/estadual', category: 'icms-cota-parte' },
          { title: 'MUNICIPAL', icon: 'city', url: '/municipal', category: 'icms-cota-parte' }
        ]
      })
    );

    // Dropdown para Cadastro (Contribuinte, Notas Fiscais, Atividades Econômicas)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-cadastro'),
        categories: [
          { id: 'contribuinte', title: 'Contribuinte' },
          { id: 'notas-fiscais', title: 'Notas Fiscais' },
          { id: 'atividades-economicas', title: 'Atividades Econômicas' }
        ],
        items: [
          // Contribuinte
          { title: 'CONTRIBUINTES', icon: 'users', url: '/contribuintes', category: 'contribuinte' },
          { title: 'SITUAÇÃO CONTRIBUINTE', icon: 'user-tag', url: '/situacao-contribuinte', category: 'contribuinte' },
          { title: 'OMISSOS', icon: 'user-slash', url: '/omissos', category: 'contribuinte' },
          { title: 'SEM MOVIMENTO', icon: 'user-clock', url: '/sem-movimento', category: 'contribuinte' },
          { title: 'VA POSITIVOS', icon: 'arrow-trend-up', url: '/va-positivos', category: 'contribuinte' },
          { title: 'VA NEGATIVOS', icon: 'arrow-trend-down', url: '/va-negativos', category: 'contribuinte' },
          { title: 'EFD LANÇAMENTOS', icon: 'receipt', url: '/efd-lancamentos', category: 'contribuinte' },
          { title: 'GIA-ICMS LANÇAMENTO', icon: 'file-invoice', url: '/gia-icms', category: 'contribuinte' },
          { title: 'MEI', icon: 'id-card', url: '/mei', category: 'contribuinte' },
          { title: 'PGDAS', icon: 'file-lines', url: '/pgdas', category: 'contribuinte' },
          { title: 'COP3', icon: 'clipboard-list', url: '/cop3', category: 'contribuinte' },
          { title: 'PRESTADORES DE SERVIÇO', icon: 'handshake', url: '/prestadores', category: 'contribuinte' },

          // Notas Fiscais
          { title: 'NF-e Entradas (109)', icon: 'file-import', url: '/nf-e-entradas', category: 'notas-fiscais', badge: '109' },
          { title: 'NF-e Declaradas (415)', icon: 'file-export', url: '/nf-e-declaradas', category: 'notas-fiscais', badge: '415' },
          { title: 'NF-e Avulsas (812)', icon: 'file-alt', url: '/nf-e-avulsas', category: 'notas-fiscais', badge: '812' },

          // Atividades Econômicas
          { title: 'CNAE', icon: 'briefcase', url: '/cnae', category: 'atividades-economicas' },
          { title: 'CLASSES', icon: 'layer-group', url: '/classes', category: 'atividades-economicas' },
          { title: 'GRUPOS', icon: 'object-group', url: '/grupos', category: 'atividades-economicas' },
          { title: 'DIVISÕES', icon: 'table-cells', url: '/divisoes', category: 'atividades-economicas' },
          { title: 'SEÇÕES', icon: 'table-columns', url: '/secoes', category: 'atividades-economicas' }
        ]
      })
    );

    // Dropdown para Relatórios (sem categorias, menu simples)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-relatorios'),
        items: [
          { title: 'EXTRATO', icon: 'file-invoice', url: '/extrato' },
          { title: 'PROGRESSÃO', icon: 'chart-line', url: '/progressao' },
          { title: 'COMPARATIVO', icon: 'balance-scale', url: '/comparativo' },
          { title: 'CONSOLIDADO', icon: 'file-contract', url: '/consolidado' },
          { title: 'DEMONSTRATIVO', icon: 'file-alt', url: '/demonstrativo' },
          { title: 'COMPARATIVO DOE', icon: 'newspaper', url: '/comparativo-doe' },
          { title: 'GRUPO ECONÔMICO', icon: 'building', url: '/grupo-economico' }
        ]
      })
    );

    // Dropdown para Importação (menu simples)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-importacao'),
        items: [
          { title: 'IMPORTAR', icon: 'file-import', url: '/importar' },
          { title: 'IMPORTADOS', icon: 'list', url: '/importados' },
          { title: 'REMESSAS', icon: 'box', url: '/remessas' },
          { title: 'PUBLICAÇÕES', icon: 'newspaper', url: '/publicacoes' },
          { title: 'EXERCÍCIOS', icon: 'dumbbell', url: '/exercicios' },
          { title: 'FILAS', icon: 'list-ol', url: '/filas' },
          { title: 'FALHAS', icon: 'triangle-exclamation', url: '/falhas' }
        ]
      })
    );

    // Dropdown para Auxiliares (menu simples com os novos itens)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-auxiliares'),
        items: [
          { title: 'Entidades', icon: 'building', url: '/auxiliares/entidades' },
          { title: 'Cidades', icon: 'city', url: '/auxiliares/cidades' },
          { title: 'CFOP', icon: 'tag', url: '/auxiliares/cfop' },
          { title: 'PORTARIAS', icon: 'file-contract', url: '/auxiliares/portarias' },
          { title: 'GRUPO ATIVIDADES', icon: 'layer-group', url: '/auxiliares/grupo-atividades' },
          { title: 'INFORMATIVOS', icon: 'info-circle', url: '/auxiliares/informativos' }
        ]
      })
    );

    // Dropdown para Acessos (menu simples com os novos itens)
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-acessos'),
        items: [
          { title: 'USUÁRIOS', icon: 'users', url: '/acessos/usuarios' },
          { title: 'PERFIL', icon: 'user-tag', url: '/acessos/perfil' },
          { title: 'PERMISSÕES', icon: 'key', url: '/acessos/permissoes' },
          { title: 'MÓDULOS', icon: 'puzzle-piece', url: '/acessos/modulos' }
        ]
      })
    );
  }

  // Método para inicializar o header no DOM
  static initialize() {
    console.log("Inicializando o Header...");
    const headerContainer = document.getElementById('header-component');
    if (headerContainer) {
      const header = new Header();
      headerContainer.innerHTML = header.render();

      // Inicializar os dropdowns após renderizar o header
      setTimeout(() => {
        header.setupDropdowns();
      }, 100);

      console.log("Header renderizado com sucesso!");
    } else {
      console.error("Elemento header-component não encontrado!");
    }
  }
}

// Criar um objeto de API compatível com o HeaderComponent
const HeaderComponent = {
  render(selector) {
    console.log("HeaderComponent.render() chamado com seletor:", selector);
    const headerContainer = document.querySelector(selector);
    if (headerContainer) {
      const header = new Header();
      headerContainer.innerHTML = header.render();

      // Inicializar os dropdowns após renderizar o header
      setTimeout(() => {
        header.setupDropdowns();
      }, 100);

      console.log("Header renderizado via HeaderComponent");
    } else {
      console.error("Seletor não encontrado:", selector);
    }
  }
};

// Inicializar o header quando o documento for carregado
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded no Header.js");
  Header.initialize();
});

// Exportar tanto a classe quanto o objeto compatível
export { Header, HeaderComponent };