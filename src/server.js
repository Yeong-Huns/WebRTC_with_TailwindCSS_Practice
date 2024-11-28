import express from 'express';

/**
 * fileName       : server.js
 * author         : Yeong-Huns
 * date           : 2024-11-28
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2024-11-28        Yeong-Huns       최초 생성
 */


//console.log("Hello World")

const app = express()

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"));


const handleListen = () => console.log('3000번 포트에서 실행중');
const port = 3000
app.listen(port, handleListen);