const dns = require('dns')

var urlFull = new URL("https://www.instagram.com");
const checkURL=(urlFull, callback)=>{

console.log(urlFull);
if(urlFull.origin == 'null'){
    console.log("url has no origin")
    callback(false)
}

else{
    dns.lookup(urlFull.host,(err,done)=>{
        if(err){
            console.log(`encountered an error!!! ${err}`)
            callback(false);
        }
        else{
            console.log(`the website is legit and it's IP is ${done}`)
            callback(true);
        }
    })
    }
}
/*
checkURL(urlFull,(checked)=>{
    if(checked){
        console.log(urlFull)
    }
    else{
       
    }
})*/

module.exports=checkURL