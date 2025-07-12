const cron = require("node-cron");
const axios = require("axios");

const APP_URL = "https://tu-app-en-render.onrender.com"; // reemplaza con tu URL real

// Cron para mantener activo de 7:00 a. m. a 2:00 a. m. (hora RD)
cron.schedule("*/14 11-23,0-5 * * *", async () => {
  try {
    await axios.get(APP_URL);
    console.log(`⏰ [${new Date().toISOString()}] Ping enviado - Status OK`);
  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Error en ping:`, error.message);
  }
});
