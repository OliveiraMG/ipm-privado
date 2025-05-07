/**
 * Utilitários para a aplicação IPM-e
 */

/**
 * Formata números para exibição no padrão brasileiro
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatNumber = (value) => {
  if (value == null) return "0";

  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."))
      : value;

  return isNaN(num)
    ? "0"
    : num.toLocaleString("pt-BR", {
        minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
        maximumFractionDigits: 2,
      });
};

/**
 * Aplica debounce em uma função
 * @param {Function} func - Função a aplicar debounce
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Aplica throttle em uma função
 * @param {Function} func - Função a aplicar throttle
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} Função com throttle
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Configurações para os tipos de toast
const TOAST_TYPES = {
  success: { icon: "check-circle", color: "green" },
  error: { icon: "exclamation-circle", color: "red" },
  warning: { icon: "exclamation-triangle", color: "yellow" },
  info: { icon: "info-circle", color: "blue" },
};

/**
 * Sistema de mensagens toast
 */
export const toast = {
  show(message, type = "info", duration = 3000) {
    const { icon, color } = TOAST_TYPES[type] || TOAST_TYPES.info;

    const toastEl = document.createElement("div");
    toastEl.className = `fixed bottom-4 right-4 bg-${color}-100 border-l-4 border-${color}-500 text-${color}-700 p-4 rounded shadow-md z-50`;
    toastEl.innerHTML = `
      <div class="flex items-center">
        <div class="py-1"><i class="fas fa-${icon} mr-2"></i></div>
        <div>
          <p class="font-bold">${
            type.charAt(0).toUpperCase() + type.slice(1)
          }</p>
          <p class="text-sm">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toastEl);

    setTimeout(() => {
      toastEl.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => {
        document.body.contains(toastEl) && document.body.removeChild(toastEl);
      }, 500);
    }, duration);
  },

  success(message, duration) {
    this.show(message, "success", duration);
  },
  error(message, duration) {
    this.show(message, "error", duration);
  },
  warning(message, duration) {
    this.show(message, "warning", duration);
  },
  info(message, duration) {
    this.show(message, "info", duration);
  },
};

/**
 * Cria um elemento DOM com atributos
 * @param {string} tag - Tag do elemento
 * @param {Object} attrs - Atributos do elemento
 * @param {string|HTMLElement} content - Conteúdo do elemento
 * @returns {HTMLElement} Elemento criado
 */
export const createElement = (tag, attrs = {}, content = "") => {
  const element = document.createElement(tag);

  // Adicionar atributos
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  // Adicionar conteúdo
  if (content) {
    if (typeof content === "string") {
      element.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      element.appendChild(content);
    }
  }

  return element;
};
