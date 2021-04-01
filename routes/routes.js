const fs = require("fs");
const filePath = "data.json";
const express = require('express');
const jsonParser = express.json();

const router = app => {
    app.get('/ships', (request, response) => {
        const content = fs.readFileSync(filePath, "utf8");
        const ships = JSON.parse(content);
        response.send(ships);
    });

    app.get("/ships/:id", function(req, res){

        const id = req.params.id;
        const content = fs.readFileSync(filePath, "utf8");
        const ships = JSON.parse(content);
        let one = null;
        for(var i=0; i<ships.length; i++){
            if(ships[i].id==id){
                one = ships[i];
                break;
            }
        }
        if(one){
            res.send(one);
        }
        else{
            res.status(404).send();
        }
    });

    app.get("/ships/search/:price", function (req, res) {
        const price = req.params.price;
        const content = fs.readFileSync(filePath, "utf8");
        const ships = JSON.parse(content);
        var shipOut = [];
    
        for (var i = 0; i < ships.length; i++) {
            if (ships[i].price < price) {
                var data = {
                    id: ships[i].id,
                    name: ships[i].name,
                    age: ships[i].age,
                    price: ships[i].price
                };
                shipOut.push(data);
            }
        }
        if (shipOut)
            res.send(shipOut);
        else
            res.status(404).send();
    });

    app.post("/ships", jsonParser, function (req, res) {

        if(!req.body) return res.sendStatus(400);
        
        let data = fs.readFileSync(filePath, "utf8");
        let ships = JSON.parse(data);
        const shipName = req.body.name;
        var shipAge = req.body.age;
        var shipPrice = req.body.price;

        
        if (!Number.isInteger(shipPrice)) 
            shipPrice = 0;

        if (!Number.isInteger(shipAge))
            shipAge = 0;
        
        let one = {name: shipName, age: shipAge, price: shipPrice};

        // находим свободный id
        var id = 1;
        while (1) 
        {
            for (var i = 0; i < ships.length; i++) 
            {
                if (ships[i].id == id) 
                {
                    id++;
                    i = -1;
                }
            }
        break;
        }

        one.id = id;
        ships.push(one);
        data = JSON.stringify(ships);
        fs.writeFileSync("data.json", data);
        res.send(one);
    });
    
    app.delete("/ships/:id", function(req, res){

        const id = req.params.id;
        let data = fs.readFileSync(filePath, "utf8");
        let ships = JSON.parse(data);
        let index = -1;
        for(var i=0; i < ships.length; i++){
            if(ships[i].id==id){
                index=i;
                break;
            }
        }
        if(index > -1){
            const one = ships.splice(index, 1)[0];
            data = JSON.stringify(ships);
            fs.writeFileSync("data.json", data);
            res.send(one);
        }
        else{
            res.status(404).send();
        }
    });

    app.put("/ships", jsonParser, function(req, res){

        if(!req.body) return res.sendStatus(400);
    
        const shipId = req.body.id;
        const shipName = req.body.name;
        var shipAge = req.body.age;
        var shipPrice = req.body.price;
    
        let data = fs.readFileSync(filePath, "utf8");
        const ships = JSON.parse(data);
        let one;
        for(var i=0; i<ships.length; i++){
            if(ships[i].id == shipId){
                one = ships[i];
                break;
            }
        }
        if(one){

            if (!Number.isInteger(shipPrice)) 
                shipPrice = 0;

            if (!Number.isInteger(shipAge))
                shipAge = 0;

            one.price = shipPrice;
            one.age = shipAge;
            one.name = shipName;
            data = JSON.stringify(ships);
            fs.writeFileSync("data.json", data);
            res.send(one);
        }
        else{
            res.status(404).send(one);
        }
    });

    
}


module.exports = router;