// Variables globales
let jugadores = [];

// Cargar datos del TSV
fetch("jugadores.tsv") // Asegúrate de que la ruta sea correcta
  .then(response => response.text())
  .then(data => {
    jugadores = procesarTSV(data);
    cargarPerfilJugador();
  })
  .catch(error => console.error("Error al cargar el TSV:", error));

// Procesar el TSV a JSON
function procesarTSV(data) {
  const rows = data.split("\n");
  const headers = rows[0].split("\t").map(header => header.trim());

  return rows.slice(1).map(row => {
    const values = row.split("\t").map(value => value.trim());
    const jugador = {};
    headers.forEach((header, index) => {
      jugador[header] = values[index];
    });
    return jugador;
  });
}








document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  const apellido = params.get("apellido");
  const username = localStorage.getItem("usuarioActual"); // Obtener el nombre de usuario actual

  if (!nombre || !apellido || !username) {
      console.error("Faltan parámetros en la URL o el usuario no ha iniciado sesión.");
      return;
  }

  // Generar una clave única para cada jugador y usuario
  const notaKey = `${username}_${nombre}_${apellido}`;

  // Cargar la nota al cargar la página
  cargarNota(notaKey);

  // Añadir eventos a los botones
  const botonGuardar = document.getElementById("guardar-nota");
  const botonEliminar = document.getElementById("eliminar-nota");

  if (botonGuardar) {
      botonGuardar.addEventListener("click", () => guardarNota(notaKey));
  }

  if (botonEliminar) {
      botonEliminar.addEventListener("click", () => eliminarNota(notaKey));
  }
});

// Función para cargar la nota desde localStorage
function cargarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaGuardada = localStorage.getItem(notaKey);

  if (notaGuardada) {
      textarea.value = notaGuardada; // Mostrar la nota guardada
  } else {
      textarea.value = ""; // Limpiar el textarea si no hay nota
  }
}

// Función para guardar la nota en localStorage
function guardarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaTexto = textarea.value;

  if (notaTexto.trim() === "") {
      alert("La nota está vacía. Escribe algo para guardar.");
      return;
  }

  localStorage.setItem(notaKey, notaTexto); // Guardar en localStorage
  mostrarMensaje("¡Nota guardada exitosamente!", "success");
}

// Función para eliminar la nota de localStorage
function eliminarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");

  localStorage.removeItem(notaKey); // Eliminar de localStorage
  textarea.value = ""; // Limpiar el textarea
  mostrarMensaje("Nota eliminada.", "error");
}

// Función para mostrar mensajes temporales
function mostrarMensaje(mensaje, tipo) {
  const mensajeElemento = document.getElementById("nota-guardada");
  mensajeElemento.textContent = mensaje;

  if (tipo === "success") {
      mensajeElemento.style.color = "green"; // Mensaje en verde
  } else if (tipo === "error") {
      mensajeElemento.style.color = "red"; // Mensaje en rojo
  }

  mensajeElemento.style.display = "block";

  setTimeout(() => {
      mensajeElemento.style.display = "none";
  }, 2000); // Ocultar mensaje después de 2 segundos
}





// Función para calcular las estrellas según el rating
function calcularEstrellas(rating) {
  if (rating >= 70 && rating <= 89) return "★★★";
  if (rating >= 90 && rating <= 97) return "★★★★";
  if (rating >= 98 && rating <= 110) return "★★★★★";
  return "Sin clasificación";
}

// Cargar perfil del jugador
function cargarPerfilJugador() {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    const apellido = params.get("apellido");

  
    // Buscar al jugador en la lista
    const jugador = jugadores.find(jugador =>
      jugador["Nombre"] === nombre && jugador["Apellido Paterno"] === apellido
    );
  
    if (!jugador) {
      alert("Jugador no encontrado.");
      return;
    }
  
    // Actualizar información del perfil
    document.getElementById("nombre").textContent = `${jugador["Nombre"]} ${jugador["Apellido Paterno"]}`;
    document.getElementById("posicionOfensiva").textContent = jugador["Posición Ofensiva"] || "N/A";
    document.getElementById("posicionDefensiva").textContent = jugador["Posición Defensiva"] || "N/A";
    document.getElementById("altura").textContent = jugador["Altura en mts"] || "N/A";
    document.getElementById("peso").textContent = jugador["Peso en Kgs"] || "N/A";
    document.getElementById("clase").textContent = jugador["Clase (Año de graduación)"] || "N/A";
    document.getElementById("Fecha de Nacimiento").textContent = jugador["Fecha de Nacimiento"] || "N/A";
    document.getElementById("promedio").textContent = jugador["Promedio Académico"] || "N/A";
    document.getElementById("club").textContent = jugador["Nombre del equipo actual"] || "N/A";
    document.getElementById("estado").textContent = jugador["Estado"] || "N/A";
    document.getElementById("dash").textContent = jugador["40 YD Dash"] || "N/A";
    document.getElementById("bench").textContent = jugador["Bench Press Max 1 REP"] || "N/A";
    document.getElementById("squat").textContent = jugador["Squat max 1 rep"] || "N/A";
    document.getElementById("logros").textContent = jugador["Logros"] || "N/A";
    document.getElementById("lesiones").textContent = jugador["Lesiones previas"] || "N/A";

    // Mostrar estrellas y rating debajo del nombre
    const ratingDiv = document.getElementById("rating");
    const estrellas = calcularEstrellas(parseFloat(jugador["Rating"] || 0));
    const ratingTexto = jugador["Rating"] ? `${jugador["Rating"]}` : "N/A";

    ratingDiv.innerHTML = `
      <span style="font-size: 20px; color: #FFD700;">${estrellas}</span>
      <span style="font-size: 16px; color: #333;"> (${ratingTexto})</span>
    `;
  
    // Cargar los datos de contacto
    cargarContacto(jugador);
  
    // Asignar funcionalidad a los botones de Highlights
    asignarBoton(document.getElementById("highlight1"), jugador["Link Highlights 1"]);
    asignarBoton(document.getElementById("highlight2"), jugador["Link Highlights 2"]);
    asignarBoton(document.getElementById("highlight3"), jugador["Link Highlights 3"]);
  
    // Asignar la foto del jugador
    const fotoElemento = document.getElementById("Foto");
    let rutaFoto = jugador["Carpeta"]; // Usar la columna "Carpeta" del TSV
  
    if (rutaFoto && rutaFoto.trim() !== "") {
      fotoElemento.src = rutaFoto; // Intenta cargar la foto
      fotoElemento.onerror = () => {
        // Si falla, intenta con otra extensión
        fotoElemento.src = rutaFoto.replace(".jpg", ".JPG");
      };
    } else {
      fotoElemento.src = "imagenes/default.jpg"; // Imagen predeterminada si no hay foto
    }



    

  }
  
  // Función para cargar información de contacto
  function cargarContacto(jugador) {
    // Actualizar campos normales
    document.getElementById("telefono").textContent = jugador["Teléfono personal"] || "N/A";
    document.getElementById("email").textContent = jugador["Correo Electrónico"] || "N/A";
    document.getElementById("nombrePadre").textContent = jugador["Nombre del Padre o Tutor"] || "N/A";
    document.getElementById("telefonoPadre").textContent = jugador["Teléfono del Padre o Tutor"] || "N/A";
    document.getElementById("nombreCoach").textContent = jugador["Nombre del Head Coach"] || "N/A";
    document.getElementById("telefonoCoach").textContent = jugador["Teléfono del Head Coach"] || "N/A";
  
    // Asignar hipervínculos a redes sociales
    asignarLink(document.getElementById("facebook"), jugador["URL Facebook"]);
    asignarLink(document.getElementById("instagram"), jugador["URL Instagram"]);
    asignarLink(document.getElementById("twitter"), jugador["URL X (Twitter)"]);
  }
  
  // Función auxiliar para asignar enlaces
  function asignarLink(elemento, url) {
    if (url && url.trim() !== "") {
      elemento.href = url;
      elemento.textContent = "Ver perfil";
      elemento.style.color = "#004992"; // Estilo del enlace
    } else {
      elemento.href = "#";
      elemento.textContent = "N/A";
      elemento.style.color = "gray"; // Enlace inactivo
    }
  }
  
  
  // Función auxiliar para asignar enlaces a botones
  function asignarBoton(button, link) {
    if (link && link.trim() !== "") {
      button.onclick = () => window.open(link, "_blank");
      button.disabled = false; // Asegúrate de que el botón esté habilitado
    } else {
      button.onclick = () => alert("No hay highlights disponibles");
      button.disabled = false; // Asegúrate de que el botón esté habilitado
    }
  }
  
  




  
