const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");
const { generarKey } = require("./helpers");

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
    res.status(500).send("Error al crear la tabla 5");
  }
});

app.get("/articulos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM articulos");

    // Añadir campo "disabled" en base a "disponible"
    const articulos = result.rows.map((art) => ({
      ...art,
      disabled: art.disponible === 0
    }));

    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los artículos");
  }
});

app.post("/articulos", async (req, res) => {
  const { nombre, cantidad, url_imagen } = req.body;

  const disponible = cantidad;
  const json_data = [];

  try {
    const result = await db.query(
      `INSERT INTO articulos (nombre, cantidad, disponible, json_data, url_imagen)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, cantidad, disponible, json_data, url_imagen]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el artículo");
  }
});

app.put("/articulos/:id/reservar", async (req, res) => {
  const { id } = req.params;
  const { usuario, cantidad } = req.body;

  if (!usuario || !cantidad) {
    return res.status(400).send("Faltan campos obligatorios: usuario o cantidad");
  }

  try {
    // 1. Obtener el artículo actual
    const result = await db.query("SELECT * FROM articulos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Artículo no encontrado");
    }

    const articulo = result.rows[0];

    if (articulo.disponible === 0 ) {
      return res.status(400).send("No hay suficiente disponibilidad");
    }

    // 2. Actualizar json_data con el nuevo usuario
    const jsonData = articulo.json_data || {};
    const key = generarKey(articulo.id, usuario);

    if (jsonData[key]) {
      jsonData[key] = { 
        ...jsonData[key],
        cantidad: parseInt( jsonData[key].cantidad ) + 1
      };
    } else {
      jsonData[key] = { usuario, cantidad };
    }

    const nuevoDisponible = articulo.disponible - cantidad;
  //  return res.json({
  //     usuario,
  //     cantidad,
  //     id,
  //     articulo,
  //     nuevoDisponible
  //   });
    // 3. Guardar cambios
    const updateResult = await db.query(
      `UPDATE articulos SET json_data = $1, disponible = $2 WHERE id = $3 RETURNING *`,
      [jsonData, nuevoDisponible, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al reservar artículo" + error.message);
  }
});

app.patch("/articulos/:id", async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  // Validar si se envió al menos un campo
  const keys = Object.keys(campos);
  if (keys.length === 0) {
    return res.status(400).send("Debe enviar al menos un campo para actualizar");
  }

  // Construir dinámicamente el SET del query
  const setClauses = [];
  const values = [];

  keys.forEach((key, index) => {
    setClauses.push(`${key} = $${index + 1}`);
    values.push(campos[key]);
  });

  const query = `
    UPDATE articulos 
    SET ${setClauses.join(", ")} 
    WHERE id = $${values.length + 1}
    RETURNING *
  `;

  values.push(id); // agregar el ID al final

  try {
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send("Artículo no encontrado");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el artículo: " + error.message);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


require("./keepAwake");