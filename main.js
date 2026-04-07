import { CarritoManager } from "./scripts/carritoManager.js";
import { ProductosHomeManager } from "./scripts/productosHome.js";

//Data
const response_productos = await fetch("/data/productos-data.json");
const productos_data = await response_productos.json();
const carritoManager = new CarritoManager();
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
