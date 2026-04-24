import { CarritoManager } from "./scripts/carritoManager.js";
import { ProductoIndividualManager } from "./scripts/productoIndividualManager.js";
import { ProductosHomeManager } from "./scripts/productosHome.js";
import { CONFIG } from "./scripts/config.js";
import { FacturacionManager } from "./scripts/FacturacionManager.js";
import { SliderManager } from "./scripts/slider-manager.js";

// console.log("stripe:", stripe);

//Especificación de Ruta
const urlBase = CONFIG.urlBase;
const urlData = `${CONFIG.urlBase}data/productos-data.json`

const response_productos = await fetch(urlData);
const productos_data = await response_productos.json();

const serverUrl = CONFIG.serverUrl;

// //Data
// const response_productos = await fetch(urlFinalDataJson)
// const productos_data = await response_productos.json();

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
productosHomeManager.init(productos_data, urlBase);
carritoManager.init(urlBase);
carritoManager.crearListeners(urlBase);
prod_indiv_manager.init(urlBase, productos_data);

//Depurador
const depurador = (e) => {
  if (e.code !== "KeyD") return;
};

document.addEventListener("keydown", (e) => {
  depurador(e);
});

await facturacionManager.init(urlBase, serverUrl);

//Modularizar logica de formulario Stripe
//Terminar div de formulario e integrar datos para enviar X
//comprobar coherencia entre cantidad carrito y cantidad divs (backend)
//Modularizar mejor archivos para stripe + Express (backend)
//Poner keys en env
