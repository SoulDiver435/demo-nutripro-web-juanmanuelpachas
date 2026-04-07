import { CarritoManager } from "./scripts/carritoManager.js";
import { ProductosHomeManager } from "./scripts/productosHome.js";

//Especificación de Ruta
const repoName = window.location.pathname.split("/")[1];
const isGitHub = window.location.hostname.includes("github.io");
const urlBase = isGitHub ? `/${repoName}/` : "/";
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

productosHomeManager.init(productos_data);

const depurador = (e) => {
  if (e.code === "KeyD") {
    console.log("Carrito:", carritoManager.listaCarrito);
    console.log(
      "%clocalStorage:",
      "background-color: #db9b2d; color: black; font-size: 13px",
      localStorage.carrito,
    );

    // const imgTemplate = carritoManager.$template.querySelector("img");

    // console.log("imgTemplate", imgTemplate);
  }
};

document.addEventListener("keydown", (e) => {
  depurador(e);
});

carritoManager.init();
carritoManager.crearListeners();
