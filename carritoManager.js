export class CarritoManager {
  #carritoActivado;
  #listaCarrito;
  constructor() {
    this.#carritoActivado = false;
    this.#listaCarrito = [];
  }

  get carritoActivado() {
    return this.#carritoActivado;
  }

  set carritoActivado(valor) {
    this.#carritoActivado = valor;
  }

  get listaCarrito() {
    return this.#listaCarrito;
  }

  init() {
    this.elementoCarrito = document.getElementById("carritoComprasDiv");
    this.botonCarrito = document.querySelector(".imgCarrito");
    this.closeButton = document.querySelector(".closeButton");
    this.overlayNegro = document.querySelector(".overlayDiv");
    this.sect1Carrito = document.querySelector(".sect1Carrito");
    this.sect2Carrito = document.querySelector(".sect2Carrito");
    this.botonSeguirComprando = document.getElementById("botonSeguirComprando");
    this.sectionProductosCarrito = document.getElementById(
      "sectionProductosCarrito",
    );
    this.$template = document.getElementById(
      "template-producto-carrito",
    ).content;
  }

  crearListeners() {
    //Listener botón carrito
    this.botonCarrito.addEventListener("click", () => {
      if (this.carritoActivado) return;
      this.carritoActivado = true;

      console.log("[Click a boton carrito]");
      this.activarElementoCarrito();
    });

    //Listener Close button
    this.closeButton.addEventListener("click", () => {
      console.log("[Close button pressed]");
      this.desactivarElementoCarrito();
    });

    //Listener Botón Seguir Comprando
    this.botonSeguirComprando.addEventListener("click", () => {
      console.log("[SeguirComprando button pressed]");
      this.desactivarElementoCarrito();
    });

    //Listener Overlay Negro
    this.overlayNegro.addEventListener("click", () => {
      if (this.carritoActivado) {
        console.log("[Overlay negro pressed]");
        this.desactivarElementoCarrito();
      }
    });

    //Listeners Botones Cantidad
    const handler = (e) => {
      if (e.target.matches(".buttonCantidadCart")) {
        const btn = e.target.closest(".buttonCantidadCart");
        const elmProducto = e.target.closest(".elmProductoCarrito");

        if (btn && elmProducto) {
          const typeBtnCantidad = btn.dataset.btnCantidad;
          const id = elmProducto.getAttribute("data-id");
          const productoInCart = this.listaCarrito.find(
            (prod) => prod.id === id,
          );

          switch (typeBtnCantidad) {
            case "plus":
              productoInCart &&
                (productoInCart.cantidad = (productoInCart.cantidad || 0) + 1);

              break;
            case "minus":
              productoInCart &&
                (productoInCart.cantidad = (productoInCart.cantidad || 1) - 1);
              break;
          }

          console.log(
            `Nueva cantidad d ${productoInCart.nombre}: ${productoInCart.cantidad}`,
          );

          if (productoInCart.cantidad <= 0) {
            this.#listaCarrito = this.listaCarrito.filter(
              (prod) => prod.id !== id,
            );
            elmProducto.remove();
            this.comprobarVisibilidad_section2_carrito()
            return;
          }

          this.actualizarCantidadElmProducto(
            elmProducto,
            productoInCart.cantidad,
          );

          //TODO restaurar mensaje de carrito vacio al quedar sin productos

          // console.log("ID de producto YA AGREGADO:", id);
          // console.log(typeBtnCantidad);
        }
      }
    };

    this.sectionProductosCarrito.addEventListener("click", (e) => handler(e));
  }

  activarElementoCarrito() {
    this.comprobarVisibilidad_section2_carrito();
    this.toggleOverlayNegro("visible");
    this.toggleElemCarrito(true);
  }

  desactivarElementoCarrito() {
    this.toggleOverlayNegro("hidden");
    this.toggleElemCarrito(false);
  }

  toggleOverlayNegro(valor) {
    if (valor === "hidden") {
      this.overlayNegro.style.opacity = 0;

      setTimeout(() => {
        this.overlayNegro.style.visibility = valor;
      }, 300);

      return;
    }
    this.overlayNegro.style.visibility = valor;
    this.overlayNegro.style.opacity = 1;
  }

  toggleElemCarrito(valor) {
    if (valor) {
      this.mostrarElmCarrito();
      return;
    }
    this.ocultarElmCarrito();
  }

  mostrarElmCarrito() {
    this.elementoCarrito.style.visibility = "visible";
    this.elementoCarrito.style.transform = "translateX(0)";
    this.elementoCarrito.style.opacity = 1;
  }

  ocultarElmCarrito() {
    this.elementoCarrito.style.transform = "translateX(100%)";
    this.elementoCarrito.style.opacity = 0;

    setTimeout(() => {
      this.elementoCarrito.style.visibility = "hidden";
      this.carritoActivado = false;
    }, 700);
  }

  comprobarVisibilidad_section2_carrito() {
    if (this.listaCarrito.length === 0) {
      this.sect1Carrito.style.marginBottom = "210px";
      this.sect2Carrito.style.display = "flex";
      this.sect2Carrito.style.visibility = "visible";
      console.log("Sect2 carrito VISIBLE");
      return;
    }
    this.sect1Carrito.style.marginBottom = "20px";
    this.sect2Carrito.style.visibility = "hidden";
    this.sect2Carrito.style.display = "none";
    this.sectionProductosCarrito.style.display = "block";
    console.log("Sect2 carrito INVISIBLE");
  }

  agregarProducto(producto) {
    this.#listaCarrito.push(producto);
  }

  crearElementoProductoCarrito(data) {
    const elmProductoCarrito = this.$template.querySelector(
      ".elmProductoCarrito",
    );
    const $fragment = document.createDocumentFragment();

    const image = elmProductoCarrito.querySelector("img");
    const infoProdCarritoDiv =
      elmProductoCarrito.querySelector(".infoProdCarrito");
    const container_cantidad_carrito = infoProdCarritoDiv.querySelector(
      ".contCantidadCarrito",
    );

    const src = data.img;
    const nombre = data.nombre;
    const precio = data.precio;
    const cantidad = data.cantidad;
    const id = data.id;

    console.log("ID:", id);
    console.log("nombre:", nombre);
    console.log("src:", src);
    console.log("precio:", precio);
    console.log("cantidad:", cantidad);

    elmProductoCarrito.setAttribute("data-id", id);
    image.classList.add("imgProdCarrito");
    image.src = src;
    infoProdCarritoDiv.querySelector(".titleProdCarrito").textContent = nombre;
    infoProdCarritoDiv.querySelector(".priceProdCarrito").textContent =
      `S/ ${precio}.00`;
    container_cantidad_carrito.querySelector(".cantidadNumCart").textContent =
      `${cantidad}`;

    let $clone = document.importNode(elmProductoCarrito, true);

    $fragment.appendChild($clone);

    this.sectionProductosCarrito.appendChild($fragment);

    console.log("template:", elmProductoCarrito);
  }

  actualizarCantidadElmProducto(elm, cantidad) {
    const elmCantidad = elm.querySelector(".cantidadNumCart");
    elmCantidad.textContent = `${cantidad}`;
  }
}
