// const navMain = document.querySelector(".main-nav");
// const toggler = document.querySelector(".page-header__toggler");
// const mapStatic = document.querySelector(".contacts__map");

// mapStatic.classList.remove("contacts__map--nojs");

// navMain.classList.remove("main-nav--nojs");
// navMain.classList.toggle("main-nav--closed");

// toggler.addEventListener("click", function() {
//   if (toggler.classList.contains("page-header__toggler--closed")) {
//     toggler.classList.remove("page-header__toggler--closed");
//     toggler.classList.add("page-header__toggler--opened");
//     toggler.setAttribute("aria-label", "Закрыть меню");

//     navMain.classList.remove("main-nav--closed");
//     navMain.classList.add("main-nav--opened");
//   } else {
//     toggler.classList.remove("page-header__toggler--opened");
//     toggler.classList.add("page-header__toggler--closed");
//     toggler.setAttribute("aria-label", "Открыть меню");

//     navMain.classList.remove("main-nav--opened");
//     navMain.classList.add("main-nav--closed");
//   }
// });

$(function () {
  $(`.slider__list`).slick({
    dots: true,
    nextArrow: `<button class="slider__controls slider__controls--prev"><svg width="16" height="29" viewBox="0 0 16 29" xmlns="http://www.w3.org/2000/svg"><use xlink:href="./img/sprite.svg#icon-arrow-left"></use></svg></button>`,
    prevArrow: `<button class="slider__controls slider__controls--next"><svg width="16" height="29" viewBox="0 0 16 29" xmlns="http://www.w3.org/2000/svg"><use xlink:href="./img/sprite.svg#icon-arrow-right"></use></svg></button>`,
  });

  $(`.search__btn`).on(`click`, function (evt) {
    evt.preventDefault();
    $(`.search__btn`).removeClass(`search__btn--active`);
    $(`.search__input`).attr(
      `placeholder`,
      `Введите ${$(this).data(`bs-target`)}`
    );
    $(this).addClass(`search__btn--active`);
  });
});
