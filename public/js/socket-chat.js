const socket = io();
let params = new URLSearchParams(window.location.search);
if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("El nombre es y las sala son necesarios");
} else {
  let usuario = {
    nombre: params.get("nombre"),
    sala: params.get("sala"),
  };
  socket.on("connect", () => {
    socket.emit("entrarChat", usuario, (res) => {
      console.log(res);
    });
  });
  socket.on("crearMensaje", (res) => {
    console.log(res);
  });
}
// Escuchar entrada o salida de el usuario
socket.on("listaPersona", (personas) => {
  console.log(personas);
});
socket.emit("enviarMensaje", () => {});
socket.on("enviarMensajePrivado", (mensaje) => {
  console.log(`Mensaje privado:`);
  console.log(mensaje);
});
