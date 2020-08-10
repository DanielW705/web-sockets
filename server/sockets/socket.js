const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearmensaje } = require("../utilities/utilidades");
const usuarios = new Usuarios();
io.on("connection", (client) => {
  client.on("entrarChat", (usuario, callback) => {
    if (!usuario.nombre || !usuario.sala) {
      return callback({
        error: true,
        message: "Necesita un nombre o una sala",
      });
    } else {
      client.join(client.sala);
      usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
      client.broadcast
        .to(usuario.sala)
        .emit("listaPersona", usuarios.getPersonasPorSala(usuario.sala));
      callback(usuarios.getPersonasPorSala(usuario.sala));
    }
  });
  client.on("enviarMensaje", (data) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearmensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
  });
  client.on("disconnect", () => {
    let personaBorrada = usuarios.borrarPersona(client.id);
    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearmensaje("Administrador", `${personaBorrada.nombre}`)
      );
    client.broadcast
      .to(personaBorrada.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
  });
  client.on("enviarMensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearmensaje(persona.nombre, data.mensaje);
    client.broadcast.to(data.para).emit("enviarMensajePrivado", mensaje);
  });
});
