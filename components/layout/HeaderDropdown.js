/**
 * HeaderDropdown.js - Componente de dropdown para o header
 * Suporta tanto menus simples quanto categorizados
 */
class HeaderDropdown {
  /**
   * Renderiza um dropdown do header
   * @param {Object} config - Configuração do dropdown
   * @param {HTMLElement|string} config.targetElement - Elemento que ativa o dropdown
   * @param {Array} config.items - Itens do menu [{title, icon, url, items}]
   * @param {Array} config.categories - Categorias para agrupamento (opcional)
   * @param {string} config.position - Posição (default: 'bottom-center')
   */
  constructor(config) {
    this.targetElement =
      typeof config.targetElement === "string"
        ? document.querySelector(config.targetElement)
        : config.targetElement;
    this.items = config.items || [];
    this.categories = config.categories || [];
    this.position = config.position || "bottom-center";
    this.dropdownElement = null;
    this.hideTimeout = null;

    this.init();
  }

  /**
   * Inicializa o dropdown
   */
  init() {
    if (!this.targetElement) {
      console.error("Elemento alvo não encontrado para o dropdown");
      return;
    }

    // Adicionar eventos de mouse
    this.targetElement.addEventListener("mouseenter", this.show.bind(this));
    this.targetElement.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );
  }

  /**
   * Mostra o dropdown
   */
  show() {
    // Remover dropdown anterior se existir
    this.removeDropdown();

    // Criar o elemento dropdown
    this.dropdownElement = document.createElement("div");
    this.dropdownElement.className =
      "absolute bg-white rounded-lg shadow-lg z-50 py-2 mt-1 border border-gray-200";

    // Adicionar conteúdo com base na estrutura de dados
    if (this.categories && this.categories.length > 0) {
      this.renderCategorizedMenu();
    } else {
      this.renderSimpleMenu();
    }

    // Adicionar eventos
    this.dropdownElement.addEventListener(
      "mouseenter",
      this.handleDropdownMouseEnter.bind(this)
    );
    this.dropdownElement.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );

    // Adicionar ao DOM
    document.body.appendChild(this.dropdownElement);

    // Posicionar o dropdown
    this.setPosition();
  }

  /**
   * Renderiza um menu categorizado horizontalmente
   */
  renderCategorizedMenu() {
    const container = document.createElement("div");
    container.className = "p-4 flex";

    // Para cada categoria, criar uma coluna
    this.categories.forEach((category, index) => {
      const column = document.createElement("div");
      column.className = index > 0 ? "ml-8 border-l pl-8" : "";
      column.style.minWidth = "200px"; // Garantir um tamanho mínimo para cada coluna

      // Título da categoria
      const title = document.createElement("h3");
      title.className =
        "text-blue-dark font-medium text-base mb-4 border-b pb-2";
      title.textContent = category.title;
      column.appendChild(title);

      // Filtrar itens dessa categoria
      const categoryItems = this.items.filter(
        (item) => item.category === category.id
      );

      // Criar lista para os itens
      const itemList = document.createElement("ul");
      itemList.className = "space-y-2";

      // Adicionar itens
      categoryItems.forEach((item) => {
        const listItem = document.createElement("li");
        const link = this.createMenuItem(item);
        listItem.appendChild(link);
        itemList.appendChild(listItem);
      });

      column.appendChild(itemList);
      container.appendChild(column);
    });

    this.dropdownElement.appendChild(container);

    // Ajustar largura para menus categorizados horizontais
    const totalWidth = this.categories.length * 280; // 200px + padding/borders
    this.dropdownElement.style.width = `${Math.min(totalWidth, 1000)}px`; // Limitar a largura máxima
  }

  /**
   * Renderiza um menu simples
   */
  renderSimpleMenu() {
    const list = document.createElement("ul");
    list.className = "py-1";

    this.items.forEach((item) => {
      const listItem = document.createElement("li");
      const link = this.createMenuItem(item);
      listItem.appendChild(link);
      list.appendChild(listItem);
    });

    this.dropdownElement.appendChild(list);

    // Definir largura para menus simples
    this.dropdownElement.style.width = "250px";
  }

  /**
   * Cria um item de menu
   * @param {Object} item - Configuração do item
   * @returns {HTMLElement} Elemento do item
   */
  createMenuItem(item) {
    const link = document.createElement("a");
    link.href = item.url || "#";
    link.className =
      "flex items-center px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-dark rounded-md text-sm";

    // Adicionar ícone se existir
    if (item.icon) {
      const icon = document.createElement("i");
      icon.className = `fa-solid fa-${item.icon} mr-2 text-blue-medium w-5 text-center`;
      link.appendChild(icon);
    }

    // Adicionar texto
    const text = document.createElement("span");
    text.textContent = item.title;
    text.className = "font-medium";
    link.appendChild(text);

    // Adicionar badge se existir
    if (item.badge) {
      const badge = document.createElement("span");
      badge.className =
        "ml-2 text-xs px-1.5 py-0.5 bg-blue-light text-white rounded-full";
      badge.textContent = item.badge;
      link.appendChild(badge);
    }

    // Adicionar evento de clique
    if (item.onClick) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        item.onClick();
      });
    }

    return link;
  }

  /**
   * Define a posição do dropdown
   */
  setPosition() {
    if (!this.dropdownElement) return;

    const rect = this.targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Remover qualquer posicionamento anterior
    this.dropdownElement.style.top = null;
    this.dropdownElement.style.left = null;
    this.dropdownElement.style.right = null;

    // Definir novo posicionamento
    switch (this.position) {
      case "bottom-center": {
        const dropdownWidth = this.dropdownElement.offsetWidth;
        const centerX = rect.left + rect.width / 2;
        const leftPos = centerX - dropdownWidth / 2;

        // Garantir que o dropdown não saia da tela
        const windowWidth = window.innerWidth;
        const finalLeft = Math.max(
          10,
          Math.min(leftPos, windowWidth - dropdownWidth - 10)
        );

        this.dropdownElement.style.top = `${rect.bottom + scrollTop}px`;
        this.dropdownElement.style.left = `${finalLeft}px`;
        break;
      }
      case "bottom-left":
        this.dropdownElement.style.top = `${rect.bottom + scrollTop}px`;
        this.dropdownElement.style.left = `${rect.left + scrollLeft}px`;
        break;
      case "bottom-right":
        this.dropdownElement.style.top = `${rect.bottom + scrollTop}px`;
        this.dropdownElement.style.right = `${
          window.innerWidth - rect.right - scrollLeft
        }px`;
        break;
      default:
        this.dropdownElement.style.top = `${rect.bottom + scrollTop}px`;
        this.dropdownElement.style.left = `${rect.left + scrollLeft}px`;
    }
  }

  /**
   * Manipula o evento de saída do mouse
   */
  handleMouseLeave() {
    this.hideTimeout = setTimeout(() => {
      this.removeDropdown();
    }, 200);
  }

  /**
   * Manipula o evento de entrada do mouse no dropdown
   */
  handleDropdownMouseEnter() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Remove o dropdown
   */
  removeDropdown() {
    // Remover todos os dropdowns existentes no documento
    document.querySelectorAll(".header-dropdown").forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // Remover o dropdown atual
    if (this.dropdownElement && this.dropdownElement.parentNode) {
      this.dropdownElement.parentNode.removeChild(this.dropdownElement);
      this.dropdownElement = null;
    }
  }

  /**
   * Método estático para criar instância rapidamente
   */
  static create(config) {
    return new HeaderDropdown(config);
  }
}

export default HeaderDropdown;
