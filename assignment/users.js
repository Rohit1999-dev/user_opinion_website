module.exports = (users, knex, jwt)=>{
    users.post("/signup",(req, res)=>{             
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        knex.insert({name:name, email:email, password:password}).into("users")
        .then((data)=>{
            knex.select("id").from("users").where("email",email)
            .then((userdata)=>{
                let id=JSON.parse(JSON.stringify(userdata))
                var accesskey = jwt.sign(id[0], "rohit",{expiresIn:"24hr"});
                res.cookie(accesskey)
                if (accesskey.length!=0){
                    console.log(accesskey);
                    res.redirect("/login")
                }
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            res.send("user is already exists")
            console.log(err)
        })
    })


    users.post ("/login" , (req ,res) => {

        var email = req.body.email;
        var password = req.body.password;
        knex.select("id").from("users").where({"email":email, "password":password})
        .then((data)=>{
            if (data.length==0){
                res.send("your email or password is not exits");
            }else{
                knex.select("id").from("users").where("email",email)
                .then((userdata)=>{
                    let id=JSON.parse(JSON.stringify(userdata))
                    var accesskey = jwt.sign(id[0], "rohit",{expiresIn:"24hr"});
                    res.cookie(accesskey)
                    if(accesskey.length!=0){
                        console.log(accesskey);
                        res.redirect("/home")
                    }
                }).catch((err)=>{
                    console.log(err)
                })  
            }
        })
    });
    users.get('/signup',(req, res)=>{
        res.sendFile(__dirname + "/signup.html")
    })
    users.get('/login',(req, res)=>{
        res.sendFile(__dirname + "/login.html")
    })
    users.get('/add_opinion',(req,res)=>{
		return res.sendFile(__dirname+'/add_opinion.html')
    })
    users.get("/home",(req,res)=>{
        knex.select("user_opinion").from("opinion")
        .then((data)=>{
            if(data.length>0){
                res.render(__dirname+"/home.ejs",{data:data})
            }else{
                res.render(__dirname+"/home.ejs",{data:[{user_opinion:"No openion Found Please Add your opinium.."}]})
            }
        })
    })
    users.get("/all_opinion",(req,res)=>{
        res.sendFile(__dirname+"/all_opinion.html")
    })
}