export class SliderManager {
  constructor() {
    this.slider = document.querySelector(".slider");
    this.slides = document.querySelectorAll(".slider img");
    this.index = 0;
    this.direction = 1; // 1 para avanzar, -1 para retroceder
  }

  init() {
    console.log("initSliderManager");
    if (this.slider && this.slides.length > 0) {
      setInterval(() => this.nextSlide(), 5000);
      console.log(
        "%c[La página SÍ posee slider]",
        "background-color: #2cbde1; color: black; font-size: 16px; font-family: 'Arial'",
      );
    } else {
      console.log(
        "%c[La página no posee slider]",
        "background-color: #e1962c; color: black; font-size: 16px",
      );
    }
  }

  nextSlide() {
   

    if (!this.slider || !this.slides.length) return;

    // Calculamos el siguiente índice
    this.index += this.direction;

    // Si llegamos a los límites, invertimos la dirección
    if (this.index >= this.slides.length - 1 || this.index <= 0) {
      this.direction *= -1;
    }

    // Scroll con el ancho actual (mejor usar scrollWidth / length para precisión)
    const slideWidth = this.slides[0].clientWidth;

    this.slider.scrollTo({
      left: slideWidth * this.index,
      behavior: "smooth",
    });
  }
}
