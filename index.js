import express from "express";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.sendFile(__dirname + "/index.html");
  } catch (error) {
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
  try {
    res.json(canciones);
  } catch (error) {
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.post("/canciones", async (req, res) => {
  try {
    const cancion = req.body;

    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    console.log(canciones);
    //const songs = [...canciones, cancion];
    console.log(canciones);
    fs.writeFileSync(
      "repertorios.json",
      JSON.stringify([...canciones, cancion])
    );
    res.send("cancion agregada");
  } catch (error) {
    console.log(error);
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.delete("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const canciones = await JSON.parse(fs.readFileSync("repertorios.json"));
    const index = canciones.findIndex((p) => (p.id = id));
    canciones.splice(index, 1);
    fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
    res.send("Producto eliminado con éxito");
  } catch (error) {
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.put("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cancion = req.body;
    const canciones = await JSON.parse(
      fs.readFileSync("repertorios.json", "utf8")
    );
    const index = canciones.findIndex((p) => (p.id = id));
    canciones[index] = cancion;
    fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
    res.send("canción modificada con éxito");
  } catch (error) {
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server On http://localhost:${PORT}`);
});
