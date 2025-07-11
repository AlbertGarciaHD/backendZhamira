const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Servidor activo!");
});

app.get("/crear-tabla", async (req, res) => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS articulos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 0,
        disponible INTEGER NOT NULL DEFAULT 0,
        json_data JSONB,
        url_imagen VARCHAR(255)
      )
    `;
    await db.query(query);
    res.send("Tabla creada con éxito");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear la tabla 4");
  }
});


app.get("/api/users", (res, req) => {
  res.send("¡Servidor activo!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
