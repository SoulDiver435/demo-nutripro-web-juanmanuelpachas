export class ProductosHomeManager {
  constructor(config) {
    this.botones_producto_home = document.querySelectorAll(
      ".buttonProdAddToCart",
    );
    /**@type {import("./carritoManager.js").CarritoManager} */
    this.carritoManager = config.carritoManager;
  }

  init(productos_data) {
    //Listeners Productos - Home
    this.botones_producto_home.forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        const producto = productos_data.find((prod) => prod.id === id);

        const productoExiste = this.carritoManager.listaCarrito.some(
          (prod) => prod.id === id,
        );

        if (productoExiste) {
          console.log(
            "%c¡El producto ya está en el carrito!",
            "background-color: #b41717; color: white",
          );
        }

        if (id && producto) {
          producto.cantidad = 1;

          const data = {
            ...producto,
          };

          if (this.carritoManager.carritoActivado) return;

          if (!productoExiste) {
            console.log(`Data de producto con ID-${id}:`, producto);
            this.carritoManager.agregarProducto(producto);
            this.carritoManager.crearElementoProductoCarrito(data);
            console.log(
              "%cEl producto NO está en el carrito - producto AGREGADO",
              "background-color: #80bbff; color: black",
            );
          }

          this.carritoManager.carritoActivado = true;
          this.carritoManager.activarElementoCarrito();
          return;
        }

        console.warn("No se encontró data de producto");
      });
    });
  }

  // crearElementosProductosCarrito(){
  //   this.carritoManager.listaCarrito.forEach((prod) => {

  //   })

  // }
}
