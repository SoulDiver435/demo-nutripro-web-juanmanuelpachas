import { CarritoManager } from "./scripts/carritoManager.js";
import { ProductoIndividualManager } from "./scripts/productoIndividualManager.js";
import { ProductosHomeManager } from "./scripts/productosHome.js";
import { CONFIG } from "./scripts/config.js";

//Especificación de Ruta
const urlBase = CONFIG.urlBase;
const urlFinal = `${window.location.origin}${urlBase}data/productos-data.json`;

//Data
const response_productos = await fetch(urlFinal);
const productos_data = await response_productos.json();

//CarritoManager
const carritoManager = new CarritoManager();

//Productos Manager
const productosHomeManager = new ProductosHomeManager({
  carritoManager: carritoManager,
});

//Producto Individual Manager
const prod_indiv_manager = new ProductoIndividualManager({
  carritoManager: carritoManager,
});

//Depurador
const depurador = (e) => {
  if (e.code === "KeyD") {
    console.log("Carrito:", carritoManager.listaCarrito);
    console.log(
      "%clocalStorage.carrito:",
      "background-color: #db9b2d; color: black; font-size: 13px",
      localStorage.carrito,
    );

    console.log(
      "%clocalStorage.lastId:",
      "background-color: #db9b2d; color: black; font-size: 13px",
      localStorage.lastProductId,
    );

    console.log("Prod.Id:", prod_indiv_manager.idProdIndiv);
  }
};
document.addEventListener("keydown", (e) => {
  depurador(e);
});

productosHomeManager.init(productos_data);
carritoManager.init();
carritoManager.crearListeners();
prod_indiv_manager.init(urlBase, productos_data);
