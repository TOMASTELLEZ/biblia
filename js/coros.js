const himnos = [
    { nombre: "ANHELO TRABAJAR POR EL SEÑOR", archivo: "../himnos/1.js" },
    { nombre: "TESTIFICA", archivo: "../himnos/2.js" },
    { nombre: "SIEMPRE YO TE SEGUIRÉ", archivo: "../himnos/3.js" },
    { nombre: "HE DE CONFIAR EN JESÚS", archivo: "../himnos/4.js" },
    { nombre: "TESTIFIQUEMOS", archivo: "../himnos/5.js" },
    { nombre: "SIN SANTIDAD", archivo: "../himnos/6.js" },
    { nombre: "YO SE QUE CRISTO", archivo: "../himnos/7.js" },
    { nombre: "MARCHAD OH JUVENTUD", archivo: "../himnos/8.js" },
    { nombre: "ORANDO SIN CESAR", archivo: "../himnos/9.js" },
    { nombre: "DEMOS GRACIAS", archivo: "../himnos/10.js" },
    { nombre: "GRACIAS DIOS", archivo: "../himnos/11.js" },
    { nombre: "OH SEÑOR ENVÍAME", archivo: "../himnos/12.js" },
    { nombre: "TOMA TIEMPO PARA ORAR", archivo: "../himnos/13.js" },
    { nombre: "CUANDO YO SENTÍ EL AMOR DE DIOS", archivo: "../himnos/14.js" },
    { nombre: "QUE MI VIDA ENTERA ESTE", archivo: "../himnos/15.js" },
    { nombre: "ENCUENTRO CON CRISTO", archivo: "../himnos/16.js" },
    { nombre: "SEMBRARE LA SIEMIENTE PRECIOSA", archivo: "../himnos/17.js" },
    { nombre: "JESUCRISTO ENTRO EN MI SER", archivo: "../himnos/18.js" },
    { nombre: "CERCA DE TI", archivo: "../himnos/19.js" },
    { nombre: "SUBLIME GRACIA", archivo: "../himnos/20.js" },
    { nombre: "AL REY ADORAD", archivo: "../himnos/21.js" },
    { nombre: "PAN DE VIDA", archivo: "../himnos/22.js" },
    { nombre: "A DIOS DEBEMOS GRATITUD", archivo: "../himnos/23.js" },
    { nombre: "CASTILLO FUERTE", archivo: "../himnos/24.js" },
    { nombre: "SI TODOS SOMOS HERMANOS", archivo: "../himnos/25.js" },
    { nombre: "VEN SEÑOR", archivo: "../himnos/26.js" },
    { nombre: "SANTO, SANTO, SANTO", archivo: "../himnos/27.js" },
    { nombre: "JUNTO A LA CRUZ", archivo: "../himnos/28.js" },
    { nombre: "CERCA, MAS CERCA", archivo: "../himnos/29.js" },
    { nombre: "EL CIELO CANTA ALEGRIA", archivo: "../himnos/30.js" },
    { nombre: "OTRO JOVEN PARA CRISTO", archivo: "../himnos/31.js" },
    { nombre: "Y NO LE CREYERON", archivo: "../himnos/32.js" },
    { nombre: "ALMA BENDICE AL SEÑOR", archivo: "../himnos/33.js" },
    { nombre: "VICTORIA EN CRISTO", archivo: "../himnos/34.js" },
    { nombre: "MI VIDA DI POR TI", archivo: "../himnos/35.js" },
    { nombre: "EN LA CRUZ", archivo: "../himnos/36.js" },
    { nombre: "ME HA TOCADO", archivo: "../himnos/37.js" },
    { nombre: "LUGAR EN TU MESA", archivo: "../himnos/38.js" },
    { nombre: "Busca primero el reino de Dios", archivo: "../himnos/39.js" },
    { nombre: "¡GLORIA, GLORIA, ALELUYA !", archivo: "../himnos/40.js" },
    { nombre: "Al Cristo vivo sirvo", archivo: "../himnos/41.js" },
    { nombre: "CRISTO ES LA PEÑA DE HOREB", archivo: "../himnos/42.js" },
    { nombre: "ACUERDATE DE TU CREADOR", archivo: "../himnos/43.js" },
    { nombre: "SOMOS UNO EN ESPIRITU", archivo: "../himnos/44.js" },
    { nombre: "ENVIAME SEÑOR", archivo: "../himnos/45.js" },
    { nombre: "LLUVIAS DE GRACIA", archivo: "../himnos/46.js" },
    { nombre: "FIRMES Y ADELANTE", archivo: "../himnos/47.js" },
    { nombre: "YO VOY CANTANDO ALEGRE", archivo: "../himnos/48.js" },
    { nombre: "LA LEY DE JEHOVA (SALMO 19:7-10)", archivo: "../himnos/49.js" },
    { nombre: "SED IMITADORES DE DIOS (EFESIOS 5 :1-2)", archivo: "../himnos/50.js" },
    { nombre: "EN EL NOMBRE DE JESUS (FILIPENSES 2:10-11)", archivo: "../himnos/51.js" },
    { nombre: "TU NOMBRE LEVANTARE", archivo: "../himnos/52.js" },
    { nombre: "SALIENDO DEL PRETORIO", archivo: "../himnos/53.js" },
    { nombre: "NO ESPERES MAS", archivo: "../himnos/54.js" },
    { nombre: "MARAVILLOSA GRACIA", archivo: "../himnos/55.js" },
    { nombre: "NADIE PUDO AMARME COMO CRISTO", archivo: "../himnos/56.js" },
    { nombre: "EL VINO A MI CORAZON", archivo: "../himnos/57.js" },
    { nombre: "BUSCABA AMOR", archivo: "../himnos/58.js" },
    { nombre: "GRANDE GOZO HAY EN MI ALMA", archivo: "../himnos/59.js" },
    { nombre: "AL BORDE", archivo: "../himnos/60.js" },
    { nombre: "ANDO CON CRISTO", archivo: "../himnos/61.js" },
    { nombre: "YO QUIERO", archivo: "../himnos/62.js" },
    { nombre: "NOBLE SOSTEN", archivo: "../himnos/63.js" },
    { nombre: "TODAS LAS PROMESAS", archivo: "../himnos/64.js" },
    { nombre: "SUMERGEME", archivo: "../himnos/65.js" },
    { nombre: "SALMO 100", archivo: "../himnos/66.js" },
    { nombre: "AL ACERCARME A TI", archivo: "../himnos/67.js" },
    { nombre: "SIN SANTIDAD", archivo: "../himnos/68.js" },
    { nombre: "GRACIAS SEÑOR", archivo: "../himnos/69.js" },
    { nombre: "EL ES TODO PARA MI", archivo: "../himnos/70.js" },
    { nombre: "QUIERO CANTAR UNA LINDA CANCION", archivo: "../himnos/71.js" },
    { nombre: "COMO POR UNA CHISPA", archivo: "../himnos/72.js" },
    { nombre: "AQUÍ ESTAN NUESTRO NIÑOS", archivo: "../himnos/73.js" },
    { nombre: "FELIZ, FELIZ CUMPLEAÑOS", archivo: "../himnos/74.js" },
    { nombre: "SOLAMENTE EN CRISTO", archivo: "../himnos/75.js" },
    { nombre: "SALMO 150", archivo: "../himnos/76.js" },
    { nombre: "TIERRA DE PALESTINA", archivo: "../himnos/77.js" },
];

const contenedor = document.getElementById('lista-himnos');

if (contenedor) {
    himnos.forEach(himno => {
        const enlace = document.createElement('a');
        const archivoParam = encodeURIComponent(himno.archivo);
        const nombreParam = encodeURIComponent(himno.nombre);
        enlace.href = `leer-coro.html?himno=${archivoParam}&nombre=${nombreParam}`;
        enlace.className = 'book-card himno-card';
        enlace.innerHTML = `
            <span class="himno-card-icon" aria-hidden="true">
                <i class="fa-solid fa-music"></i>
            </span>
            <span class="himno-card-info">
                <span class="himno-card-label">Himno</span>
                <span class="himno-card-title"></span>
            </span>
            <i class="fa-solid fa-arrow-right himno-card-arrow" aria-hidden="true"></i>
        `;
        enlace.querySelector('.himno-card-title').textContent = himno.nombre;
        contenedor.appendChild(enlace);
    });
}
