export class ProductoIndividualManager {
  #idProdIndiv;
  /**@type {Object[]} */
  productosData;
  constructor() {
    this.title = document.title;
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

    // if (this.templateProdInvid) {
    //   console.log("Es pag. Prod. Indiv");
    // } else {
    //   console.log("No es pag. prod. indiv.");
    // }

    this.crearListenersProdsIndividuales(url);
    this.crearElementosProductoIndividual(url);
  }

  crearListenersProdsIndividuales(url) {
    const elementosProdsIndiv = document.querySelectorAll(".contImgProdProm");

    elementosProdsIndiv.forEach((elm) => {
      elm.addEventListener("click", () => {
        console.log("Elm. prod. indiv. clickado!");
        const id = elm.dataset.id;
        this.guardarId(id);

        const urlBase = url;
        const urlFinal = `${window.location.origin}${urlBase}producto-indiv/productoIndiv.html`;

        window.location.href = urlFinal;

        console.log("id:", id);
      });
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

      this.sectionProductoIndividual = document.getElementById(
        "sectionProductoIndiv",
      );

      const urlBase = url;

      //Crear fragment
      const $fragment = document.createDocumentFragment();

      //Recoger valores de data del producto
      const nombreProducto = dataProducto.nombre;
      const dataSrc = dataProducto.imgProdIndiv;
      const dataDetails = dataProducto.descripcion;
      const precio = dataProducto.precio;

      //Capturar Elementos del template
      const elmRoute =
        this.$templateContent.querySelector(".currentPageRoute ");

      const elmProdInfo =
        this.$templateContent.getElementById("contInfoProducto");

      const image = elmProdInfo.querySelector("img");
      const headerProd = elmProdInfo.querySelector(".prodIndivHeader");
      const elmTextDetails = elmProdInfo.querySelector(
        ".textDetailsProductoIndiv",
      );
      const elmPrice = elmProdInfo.querySelector(".priceProdIndiv");

      //Reasignar valores del template y DOM
      document.title = `NutriPro - ${nombreProducto}`;

      elmRoute.querySelector(".highlightCurrentPage").textContent =
        nombreProducto;

      headerProd.textContent = nombreProducto;

      let nuevaDescripcion = "";
      dataDetails.forEach((t, index) => {
        if (index > 0) {
          nuevaDescripcion += "<br /><br />";
        }

        let texto = t;
        nuevaDescripcion += texto;
      });

      elmTextDetails.innerHTML = nuevaDescripcion;
      elmPrice.textContent = `S/ ${precio}.00`;

      image.src = `${window.location.origin}${urlBase}${dataSrc.replace(/^\//, "")}`;

      //Clonar elementos del template
      let $cloneElmRoute = document.importNode(elmRoute, true);
      let $cloneElmProdInfo = document.importNode(elmProdInfo, true);

      //Llenar el fragment provisional
      $fragment.appendChild($cloneElmRoute);
      $fragment.appendChild($cloneElmProdInfo);

      //Llenar la section verdadera de prod. Indiv
      this.sectionProductoIndividual.appendChild($fragment);

      //
      console.log("template:", this.$templateContent);
      console.log("elmPrice:", elmPrice);
      console.log("urlbase:", urlBase);
    }
  }
}
