const dns = require('dns')

const checkURL=(urlFull, callback)=>{

//console.log(urlFull);
if(urlFull.origin == 'null'){
    console.log("url has no origin")
    callback(false)
}

else{
    dns.lookup(urlFull.host,(err,done,family)=>{
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

/*checkURL(urlFull,(checked)=>{
    if(checked){
    }
    else{
       
    }
})*/

module.exports=checkURL