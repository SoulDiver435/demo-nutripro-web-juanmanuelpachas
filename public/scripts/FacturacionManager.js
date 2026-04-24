import { CONFIG } from "./config.js";

export class FacturacionManager {
  /**@type {import("./carritoManager.js").CarritoManager} */
  carritoManager;
  #elements;
  #stripe;
  constructor(config) {
    this.carritoManager = config.carritoManager;
  }
  get elements() {
    return this.#elements;
  }
  async init(urlBase, serverUrl) {
    const esPagFacturacion = this.detectarPaginaFactuacion();
    // console.log(serverUrl);

    if (!esPagFacturacion) return;

    const res = await fetch(`${serverUrl}/config`);
    const { STRIPE_PUBLIC_KEY } = await res.json();

    this.#stripe = Stripe(STRIPE_PUBLIC_KEY);

    this.paymentFormElm = document.querySelector("#payment-form");

    await this.inicializarStripeElements();
    this.configurarListenerPago(urlBase);

    //Capturar Elementos del DOM
    this.vistaCarritoFact = document.querySelector(".vistaCarritoFacturacion");
    this.sectFacturacion = document.querySelector(".sectFacturacion");

    //Capturar Template
    this.$template = document.getElementById(
      "elemento-carrito-facturacion-template",
    )?.content;

    //Comprobar Lista Carrito
    const listaCarrito = this.carritoManager.listaCarrito;
    if (listaCarrito.length <= 0) return;

    console.log(
      "%c- Se encontraron elementos en el carrito para facturar -",
      "background-color: #e3a63d; color: black; font-size: 20px; font-family: 'Arial'",
    );

    this.comprobarTotalFacturación();
    this.crearTodosElementosVistaCarrito(listaCarrito, urlBase);
    this.crearListenersCantidad();
  }

  detectarPaginaFactuacion() {
    const elmCarritoFact = document.getElementById(
      "elemento-carrito-facturacion-template",
    );

    if (!elmCarritoFact) {
      console.log(
        "%cLa página no es de facturación.",
        "background-color: #c3582b; color: white; font-size: 12px ",
      );

      return false;
    }

    console.log(
      "%cPágina Facturación Detectada.",
      "background-color: #57bd36; color: black; font-size: 16px; border-radius: 5px",
    );
    return true;
  }

  crearTodosElementosVistaCarrito(listaCarrito, urlBase) {
    const templateElmCarrito = this.$template.querySelector(
      ".prodCarritoFacturacion",
    );

    const elementosTemplate =
      this.capturarElementosTemplate(templateElmCarrito);

    listaCarrito.forEach((prod, index) => {
      this.crearElementoVistaCarrito(
        prod,
        templateElmCarrito,
        elementosTemplate,
        urlBase,
      );
    });
  }

  crearElementoVistaCarrito(
    prod,
    templateElmCarrito,
    elementosTemplate,
    urlBase,
  ) {
    //Definir Data
    const nombre = prod.nombre;
    const cantidad = prod.cantidad;
    const src = prod.img;
    const precio = prod.precio;
    const id = prod.id;

    //Crear Fragment
    const $fragment = document.createDocumentFragment();

    let precioTotalProdIndividual = precio * cantidad;

    //Reasignar Valores
    templateElmCarrito.dataset.id = id;
    elementosTemplate.image.src = `${urlBase}${src?.replace(/^\//, "")}`;
    elementosTemplate.title.textContent = nombre;
    elementosTemplate.elmCantidad.textContent = `${cantidad}`;
    elementosTemplate.elmCantidad.dataset.id = id;
    elementosTemplate.elmPrecio.textContent = `S/ ${precioTotalProdIndividual}.00`;

    elementosTemplate.btnCantidadPlus.dataset.id = id;
    elementosTemplate.btnCantidadMinus.dataset.id = id;

    //Clonar e Inyectar elemento nuevo
    let $clone = document.importNode(templateElmCarrito, true);
    $fragment.appendChild($clone);
    this.vistaCarritoFact.appendChild($fragment);
  }

  capturarElementosTemplate(templateElmCarrito) {
    const image = templateElmCarrito.querySelector("img");
    const title = templateElmCarrito.querySelector(".prodcarritoFactTitle");
    const elmCantidad = templateElmCarrito.querySelector(
      ".carritoFactCantidadNum",
    );
    const elmPrecio = templateElmCarrito.querySelector(
      ".priceCarritoFacturacion",
    );

    const btnCantidadPlus = templateElmCarrito.querySelector(
      '[data-btn-cantidad="plus"]',
    );
    const btnCantidadMinus = templateElmCarrito.querySelector(
      '[data-btn-cantidad="minus"]',
    );

    return {
      image: image,
      title: title,
      elmCantidad: elmCantidad,
      elmPrecio: elmPrecio,
      btnCantidadPlus: btnCantidadPlus,
      btnCantidadMinus: btnCantidadMinus,
    };
  }

  crearListenersCantidad() {
    this.vistaCarritoFact.addEventListener("click", (e) => {
      if (e.target.matches(".carritoFactBtnCantidad")) {
        const btn = e.target.closest(".carritoFactBtnCantidad");

        if (btn) {
          const id = btn.getAttribute("data-id");
          const type = btn.getAttribute("data-btn-cantidad");
          const productoInCart = this.carritoManager.listaCarrito.find(
            (prod) => prod.id === id,
          );

          const elementosProdCarrito = this.vistaCarritoFact.querySelectorAll(
            ".prodCarritoFacturacion",
          );
          const elmProdCarritoFound = Array.from(elementosProdCarrito).find(
            (elm) => elm.dataset.id === id,
          );

          switch (type) {
            case "plus":
              productoInCart &&
                (productoInCart.cantidad = (productoInCart.cantidad || 0) + 1);
              break;
            case "minus":
              productoInCart &&
                (productoInCart.cantidad = (productoInCart.cantidad || 1) - 1);
              break;
          }

          this.comprobarTotalFacturación(elmProdCarritoFound);

          //Eliminar elemento del carrito que llegue a 0
          if (productoInCart.cantidad <= 0) {
            this.carritoManager.eliminarProducto(id);
            elmProdCarritoFound.remove();
            console.log(
              `%c[El producto ${productoInCart.nombre} fue eliminado]`,
              "background-color: #eb2222; color: white; font-size: 20px",
            );
            return;
          }

          this.actualizarElmCantidadVistaCarrito(
            elmProdCarritoFound,
            productoInCart.cantidad,
            productoInCart.precio,
          );

          this.carritoManager.guardarEnLocalStorage();
        }
      }
    });
  }

  actualizarElmCantidadVistaCarrito(
    elmProdCarritoFound,
    cantidadNueva,
    precio,
  ) {
    const elmCantidad = elmProdCarritoFound.querySelector(
      ".carritoFactCantidadNum",
    );
    const elmPrice = elmProdCarritoFound.querySelector(
      ".priceCarritoFacturacion",
    );

    let nuevoPrecio = cantidadNueva * precio;

    elmCantidad.textContent = `${cantidadNueva}`;
    elmPrice.textContent = `S/ ${nuevoPrecio}.00`;
  }

  comprobarTotalFacturación() {
    const listaCarrito = this.carritoManager.listaCarrito;
    const elmSubtotal = this.sectFacturacion.querySelector(".elmSubtotal");
    const elmEnvio = this.sectFacturacion.querySelector(".elmEnvio");
    const elmTotal = this.sectFacturacion.querySelector(".elmTotal");

    let sumaSubtotal = 0;
    let envio = 10;

    listaCarrito.forEach((prod) => {
      const precio = prod.precio;
      const cantidad = prod.cantidad;
      let calculoTotalProd = precio * cantidad;

      sumaSubtotal += calculoTotalProd;
    });

    elmSubtotal.textContent = `S/ ${sumaSubtotal}.00`;
    elmEnvio.textContent = `S/ ${envio}.00`;

    const TOTAL = sumaSubtotal + envio;

    elmTotal.textContent = `S/ ${TOTAL}.00`;
  }

  async inicializarStripeElements() {
    const carrito = this.carritoManager.listaCarrito;

    if (carrito.length === 0) {
      console.warn("El carrito está vacío, no se puede iniciar el pago");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.serverUrl}/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carrito }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error del servidor:", data.error);
        return;
      }

      const { clientSecret } = data;

      const elementsOptions = {
        clientSecret: clientSecret,
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
          },
        ],
        appearance: {
          theme: "flat",
          variables: {
            colorText: "#575353",
            fontFamily: "Roboto, sans-serif",
            fontWeightNormal: "400",
            // Redondeamos a 15px para evitar renderizados borrosos por decimales
            fontSizeBase: "20px",
          },
          rules: {
            ".Input": {
              // Usamos un número entero aquí también
              fontSize: "18px",
            },
            ".Label": {
              fontSize: "20px",
            },
          },
        },
      };

      //Instancia de elements
      this.#elements = this.#stripe.elements(elementsOptions);

      //Componente en el HTML
      const paymentElement = this.#elements.create("payment", {
        layout: "tabs",
      });
      paymentElement.mount("#payment-element");
    } catch (error) {
      console.error("Error al inicializar Stripe:", error);
    }
  }

  configurarListenerPago(urlBase) {
    //Sin el elemento no continuamos
    if (!this.paymentFormElm) return;

    //Listener
    this.paymentFormElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      //Botón del DOM
      const submitBtn = this.paymentFormElm.querySelector("button");
      //Elm Mensaje Payment
      const messageContainer = document.querySelector("#payment-message");

      //Validar cantidades del DOM y del caritoManager
      const coherenciaCantidades = this.comprobarCoherenciaCantidades();

      if (coherenciaCantidades) {
        console.log(
          "%c--Las cantidades son coherentes--",
          "background-color: #90db40; color: black; font-size: 14px",
        );
      } else {
        console.log(
          "%c--ERROR - Las cantidades no coinciden | No se procesará el pago--",
          "background-color: #db4040; color: white; font-size: 16px",
        );

        messageContainer.style.color = "#e73636";
        messageContainer.textContent = "Error: No se pudo efectuar el pago.";

        return;
      }

      //Validar ANTES de deshabilitar
      const valueInputNombre = this.paymentFormElm
        .querySelector("#nombre")
        .value.trim();
      const valueInputApellido = this.paymentFormElm
        .querySelector("#apellidos")
        .value.trim();

      //Validación de datos de input propios
      if (valueInputNombre === "" || valueInputApellido === "") {
        // const messageContainer = document.querySelector("#payment-message");
        messageContainer.textContent =
          "Por favor, completa todos los campos de identificación.";
        messageContainer.classList.remove("hidden");
        return; // Sale antes de deshabilitar el botón
      }

      //Botón desactivado por default
      submitBtn.disabled = true;

      if (!this.#elements) {
        console.error("No se encontró la instancia de Stripe Elements.");
        submitBtn.disabled = false;
        return;
      }

      //Verificar el resultado de submit()
      const { error: submitError } = await this.#elements.submit();
      if (submitError) {
        // const messageContainer = document.querySelector("#payment-message");
        messageContainer.textContent = submitError.message;
        submitBtn.disabled = false;
        return; // Sin esto, confirmPayment se llama igual con datos inválidos
      }

      const successUrl = new URL(
        `${urlBase}assets/success.html`,
        window.location.origin,
      ).toString();

      //Solicitar confirmación de pago
      const { error } = await this.#stripe.confirmPayment({
        elements: this.#elements,
        confirmParams: {
          return_url: successUrl,
          payment_method_data: {
            billing_details: {
              name: `${valueInputNombre} ${valueInputApellido}`,
            },
          },
        },
      });

      if (error) {
        // const messageContainer = document.querySelector("#payment-message");
        messageContainer.textContent = error.message;
        submitBtn.disabled = false;

        console.error("Stripe error completo:", error);
      }
    });
  }

  comprobarCoherenciaCantidades() {
    const carrito = this.carritoManager.listaCarrito;
    const elmVistaCarrito = document.querySelector(".vistaCarritoFacturacion");
    const elementosCantidad = elmVistaCarrito.querySelectorAll(
      ".carritoFactCantidadNum",
    );

    if (elementosCantidad.length !== carrito.length) return false;

    return carrito.every((prod, index) => {
      const cantidadDOM = Number(elementosCantidad[index].textContent);
      return cantidadDOM === prod.cantidad;
    });
  }
}
