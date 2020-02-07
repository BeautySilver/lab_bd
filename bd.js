const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "labdb",
    password: "S233kaas17102001"
});
// получение списка пользователей
app.get("/", function(req, res){
    pool.query("SELECT * FROM parking_car", function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            users: data
        });
    });
});
// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД
app.post("/create", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const number = req.body.number;
    const make = req.body.make;
    const color = req.body.color;
    const owner = req.body.owner;
    const enter = req.body.enter;
    const exit_time = req.body.exit_time;


    pool.query("INSERT INTO parking_car (number, make, color, owner, enter, exit_time) VALUES (?,?,?,?,CURRENT_TIMESTAMP,?)", [number, make, color, owner, exit_time], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");

    });
});

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function(req, res){
    const id = req.params.id;
    console.log(id);
    pool.query("SELECT * FROM parking_car WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("edit.hbs", {
            user: data[0]
        });
    });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const number = req.body.number;
    const make = req.body.make;
    const color = req.body.color;
    const owner = req.body.owner;
    const enter = req.body.enter;
    const exit_time = req.body.exit_time;
    const id = req.body.id;


    pool.query("UPDATE parking_car SET number=?, make=?, color=?, owner=?, enter=?, exit_time=?  WHERE id=?", [number, make,color,owner,enter,exit_time, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res){

    const id = req.params.id;
    pool.query("DELETE FROM parking_car WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});
/*app.post("/sort/:column_name", function(req,res){
const column_name=;
pool.query("SELECT * FROM parking_car ORDER BY ?", [column_name], function (err, data){
    if (err) return console.log(err);
    res.redirect("/")
});
});*/
    app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});