module.exports = (opinion, Knex, jwt)=>{
    opinion.post('/opinion',(req, res)=>{
        var user_opinion = req.body.user_opinion;
        var get_cookie = req.headers.cookie.split(" ");
        var slice_cookie = get_cookie[get_cookie.length-1].slice(0,-10);
        // console.log(slice_cookie)
        jwt.verify(slice_cookie, "rohit",(err, data)=>{
            // console.log(data.id)
            if(!err){
                console.log(data,req.body);
                
                Knex.insert({user_id:data.id, user_opinion:user_opinion}).into("opinion")
                .then((data)=>{
                    res.redirect("/home")
                }).catch((err)=>{
                    res.send(err.message);
                })               
            }else{
                res.send(err.message);
            }
        })
    })

    opinion.get('/get',(req, res)=>{
        var user_opinion = req.body.user_opinion;
        var get_cookie = req.headers.cookie.split(" ");
        var slice_cookie = get_cookie[get_cookie.length-1].slice(0,-10);
        // console.log(slice_cookie)
        jwt.verify(slice_cookie, "rohit",(err, data)=>{
            // console.log(data.id)
            if(!err){
                Knex.select('*').from('opinion').where("user_id",data.id)
                .then((data)=>{
                    res.render(__dirname+"/all_opinion.ejs",{data:data})
                }).catch((err)=>{
                    res.send(err.message)
                })
                
    
                }
        })
})
}