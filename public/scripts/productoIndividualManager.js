export class ProductoIndividualManager {
  #idProdIndiv;
  /**@type {Object[]} */
  productosData;
  /**@type {import("./carritoManager.js").CarritoManager} */
  carritoManager;
  constructor(config) {
    this.title = document.title;
    this.cantidadProvisional = 1;
    this.carritoManager = config.carritoManager;
  }

  get idProdIndiv() {
    return this.#idProdIndiv;
  }

  init(url, data) {
    this.templateProdInvid = document.getElementById(
      "template-section-prodIndiv",
    );
    this.$templateContent = this.templateProdInvid?.content ?? null;
    this.#idProdIndiv = this.cargarId() ?? "000";
    this.productosData = data;

    this.crearListenersProdsIndividuales(url);
    this.crearElementosProductoIndividual(url);
    this.crearListenersCantidad();
    this.crearListenerAnadirAlCarrito();
  }

  crearListenersProdsIndividuales(url) {
    const elementosProdsIndiv = document.querySelectorAll(".contImgProdProm");

    elementosProdsIndiv.forEach((elm) => {
      elm.addEventListener("click", () => {
        console.log("Elm. prod. indiv. clickado!");
        const id = elm.dataset.id;

        if (id == null) {
          console.log(
            `%cID inválido o no definido`,
            "background-color: #f14242; color: white; font-size: 15px",
          );
          return;
        }

        this.guardarId(id);

        const urlBase = url;
        const urlFinal = `${window.location.origin}${urlBase}public/producto-indiv/productoIndiv.html`;

        window.location.href = urlFinal;

        console.log("id:", id);
      });
    });
  }

  crearListenersCantidad() {
    const handler = (e) => {
      if (e.target.matches(".btnCantidadProd")) {
        const btn = e.target.closest(".btnCantidadProd");

        if (btn) {
          const typeBtnCantidad = btn.getAttribute("data-btn-cantidad");

          switch (typeBtnCantidad) {
            case "plus":
              this.cantidadProvisional++;
              break;
            case "minus":
              if (this.cantidadProvisional >= 2) {
                this.cantidadProvisional--;
              }
              break;
          }

          this.actualizarElmCantidad();
        }
      }
    };

    this.sectionProductoIndividual?.addEventListener("click", (e) =>
      handler(e),
    );
  }
  actualizarElmCantidad() {
    const elmCantidad = this.sectionProductoIndividual.querySelector(
      ".numCantidadProdIndiv",
    );

    elmCantidad.textContent = `${this.cantidadProvisional}`;
  }

  crearListenerAnadirAlCarrito() {
    const btnAnadirCarrito = this.sectionProductoIndividual?.querySelector(
      ".btnAnadirAlCarrito",
    );

    btnAnadirCarrito?.addEventListener("click", () => {
      const id = this.sectionProductoIndividual.getAttribute("data-id");
      const productoData = this.productosData.find((data) => data.id === id);
      const productoExiste = this.carritoManager.listaCarrito.some(
        (prod) => prod.id === id,
      );

      switch (productoExiste) {
        case true:
          const productoExistente = this.carritoManager.listaCarrito.find(
            (prod) => prod.id === id,
          );

          productoExistente.cantidad = this.cantidadProvisional;

          const elementosProductos =
            this.carritoManager.sectionProductosCarrito.querySelectorAll(
              ".elmProductoCarrito",
            );

          const elmProductoEncontrado = Array.from(elementosProductos).find(
            (prod) => prod.dataset.id === id,
          );

          this.carritoManager.actualizarCantidadElmProducto(
            elmProductoEncontrado,
            productoExistente.cantidad,
          );

          console.log(
            "%cEl producto ya existe: CANTIDAD MODIFICADA",
            "background-color: #86d54d; color: black; font-size: 14px",
          );
          break;
        case false:
          const productoTemporal = {
            ...productoData,
            cantidad: this.cantidadProvisional,
          };

          this.carritoManager.agregarProducto(productoTemporal);
          this.carritoManager.crearElementoProductoCarrito(productoTemporal);
          console.log(
            "%cEl producto NO existe : producto AGREGADO",
            "background-color: #df9b35; color: black; font-size: 14px",
          );
          break;
      }

      this.carritoManager.guardarEnLocalStorage();
      this.carritoManager.carritoActivado = true;
      this.carritoManager.activarElementoCarrito();
    });
  }

  guardarId(id) {
    console.log(
      `%cGuardado id: ${id} en localStorage`,
      "background-color: #52db57; color: black; font-size: 12px",
    );
    localStorage.setItem("lastProductId", id);
  }
  cargarId() {
    const prodIndivId = localStorage.getItem("lastProductId");

    if (prodIndivId != null) {
      console.log(
        `%cSe encontró id guardado de prod. Indiv.: ${prodIndivId}`,
        "background-color: #36dfc3; color: black; font-size: 14px",
      );
    } else {
      console.warn(
        "%cNo se encontró id guardado de de prod. Indiv.",
        "background-color: #c21919; color: white; font-size: 14px",
      );
    }

    return prodIndivId;
  }

  crearElementosProductoIndividual(url) {
    if (this.idProdIndiv !== "000" && this.templateProdInvid) {
      const dataProducto = this.productosData.find(
        (d) => d.id === this.idProdIndiv,
      );

      if (!dataProducto) {
        console.warn(
          `%cData de producto con id ${this.idProdIndiv} no encontrada`,
          "background-color: #e83131; color: white; font-size: 15px",
        );
        return;
      }

      console.log(
        "%cData de producto encontrada:",
        "background-color: #e8c031; color: black; font-size: 15px",
        dataProducto,
      );

      //Capturar elementos del DOM
      this.sectionProductoIndividual = document.getElementById(
        "sectionProductoIndiv",
      );

      //Url base
      const urlBase = url;

      //Crear fragment
      const $fragment = document.createDocumentFragment();

      //Recoger valores de data del producto
      const valoresDataProducto = {
        nombreProducto: dataProducto.nombre,
        dataSrc: dataProducto.imgProdIndiv,
        dataDetails: dataProducto.descripcion,
        precio: dataProducto.precio,
      };

      //Capturar Elementos del template
      const elmProdInfo =
        this.$templateContent.getElementById("contInfoProducto");
      const elementosTemplate = this.capturarElementosTemplate(elmProdInfo);

      this.sectionProductoIndividual.setAttribute("data-id", this.idProdIndiv);

      //Reasignar valores del template y DOM
      this.reasignarValoresElementos(
        valoresDataProducto,
        urlBase,
        elementosTemplate,
      );

      //Clonar elementos del template
      let $cloneElmRoute = document.importNode(
        elementosTemplate.elmRoute,
        true,
      );
      let $cloneElmProdInfo = document.importNode(
        elementosTemplate.elmProdInfo,
        true,
      );

      //Llenar el fragment provisional
      $fragment.appendChild($cloneElmRoute);
      $fragment.appendChild($cloneElmProdInfo);

      //Llenar la section verdadera de prod. Indiv
      this.sectionProductoIndividual.appendChild($fragment);

      console.log(
        "Section Prod. Indiv. final:",
        this.sectionProductoIndividual,
      );
    }
  }
  capturarElementosTemplate(elmProdInfo) {
    const elementos = {
      elmRoute: this.$templateContent.querySelector(".currentPageRoute "),
      elmProdInfo: this.$templateContent.getElementById("contInfoProducto"),
      image: elmProdInfo.querySelector("img"),
      headerProd: elmProdInfo.querySelector(".prodIndivHeader"),
      elmTextDetails: elmProdInfo.querySelector(".textDetailsProductoIndiv"),
      elmPrice: elmProdInfo.querySelector(".priceProdIndiv"),
    };

    return elementos;
  }
  reasignarValoresElementos(valoresDataProducto, urlBase, elementosTemplate) {
    document.title = `NutriPro - ${valoresDataProducto.nombreProducto}`;

    elementosTemplate.elmRoute.querySelector(
      ".highlightCurrentPage",
    ).textContent = valoresDataProducto.nombreProducto;

    elementosTemplate.headerProd.textContent =
      valoresDataProducto.nombreProducto;

    let nuevaDescripcion = "";
    valoresDataProducto.dataDetails?.forEach((t, index) => {
      if (index > 0) {
        nuevaDescripcion += "<br /><br />";
      }

      let texto = t;
      nuevaDescripcion += texto;
    });

    if (!nuevaDescripcion) {
      console.warn(
        "%cNo se encontró data de Descripción de Producto Individual.",
        "background-color: #da3030; color: white; font-size: 15px",
      );
    }

    elementosTemplate.elmTextDetails.innerHTML = nuevaDescripcion;
    elementosTemplate.elmPrice.textContent = `S/ ${valoresDataProducto.precio}.00`;

    if (!valoresDataProducto.dataSrc) {
      console.warn(
        "%cNo se encontró data de SRC de imagen del Producto Individual.",
        "background-color: #da3030; color: white; font-size: 15px",
      );

      elementosTemplate.image.style.display = "none";
      return;
    }

    elementosTemplate.image.src = `${window.location.origin}${urlBase}${valoresDataProducto.dataSrc?.replace(/^\//, "")}`;
  }
}
