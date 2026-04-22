import { CarritoManager } from "./scripts/carritoManager.js";
import { ProductoIndividualManager } from "./scripts/productoIndividualManager.js";
import { ProductosHomeManager } from "./scripts/productosHome.js";
import { CONFIG } from "./scripts/config.js";
import { FacturacionManager } from "./scripts/FacturacionManager.js";
import KEYS from "./assets/keys.js";
import { SliderManager } from "./scripts/slider-manager.js";

const options = { headers: { Authorization: `Bearer ${KEYS.secret}` } };

// console.log("stripe:", stripe);

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

//Facturación Manager
const facturacionManager = new FacturacionManager({
  carritoManager: carritoManager,
  urlBase: urlBase,
});

//Lógica Slider
const sliderManager = new SliderManager();

sliderManager.init();
productosHomeManager.init(productos_data);
carritoManager.init();

carritoManager.crearListeners(urlBase);

prod_indiv_manager.init(urlBase, productos_data);

await facturacionManager.init(urlBase);

//Modularizar logica de formulario Stripe
//Terminar div de formulario e integrar datos para enviar X
//TODO comprobar coherencia entre cantidad carrito y cantidad divs (backend)
//TODO Modularizar mejor archivos para stripe + Express (backend)
//TODO Poner keys en env

//Depurador
const depurador = (e) => {
  if (e.code === "KeyD") {
  }
};
document.addEventListener("keydown", (e) => {
  depurador(e);
});
