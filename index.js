const express = require('express');
const http = require('http');
var uuid = require("uuid");
var crypto = require("crypto");
const app = express();
const port = 3000;
var HashMap = require('hashmap');
var map = new HashMap();
/*
app.use(
    express.urlencoded({
      extended: true
    })
  ); */
app.use(express.json());
app.get('/aadhar/validate',(req,res) => {
    if(req.query.aadharNumber == "30300"){
        console.log('validate request receieved from '+req.ip);
        res.statusCode =200;
        res.send("valid");
    } else {
        //res.sendStatus(200).send("invalid");
        res.statusCode =200;
        res.send("invalid");
        //res.send('Hello World');
    }
    
});
app.get('/pan/validate',(req,res) => {
    if(req.query.panNumber == "AAMPE6140M"){
        console.log('validate request receieved from '+req.ip);
        res.statusCode =200;
        res.send("valid");
    } else {
        //res.sendStatus(200).send("invalid");
        res.statusCode =200;
        res.send("invalid");
        //res.send('Hello World');
    }
});
app.get('/license/validate',(req,res) => {
    if(req.query.panNumber == "LIC12345"){
        res.status(200).send("valid");
    } else {
        res.send(200).send("invalid");
        //res.send('Hello World');
    }
});
// check whether report for destination
app.post('/weather/validate',(req,res) => {
    if(req.query.panNumber == "AAMPE6140M"){
        console.log('validate request receieved from '+req.ip);
        res.statusCode =200;
        res.send("valid");
    } else {
        //res.sendStatus(200).send("invalid");
        res.statusCode =200;
       res.setHeader("Content-Type","application/json");
       var weather = {
           "floodwarning":"Y",
           "roadtransportworking":"Y",
           "railtransportwroking":"Y",
           "airtrafficworking":"Y"
       };
       res.send(weather);
        //res.send('Hello World');
    }
});

// IDMS A3 Token - generate 
app.post('/idms/api/v1/service/app-tokens',(req,res) => {

    console.log(req.body);
    var a3TokenResponse = {

    };
    a3TokenResponse.token = crypto.randomBytes(32).toString('hex');
    map.set(a3TokenResponse.token,req.body);
    res.send(a3TokenResponse);
});

// IDMS A3 Token - validate or token info  
app.get('/idms/api/v1/service/app-tokens/:appToken',(req,res) => {
    var appToken = req.params['appToken'];
    console.log (" A3 token received is "+ appToken);
    if(appToken !== null) {
        if(map.has(appToken)) {
            res.statusCode = 200;
            res.send(map.get(appToken));
        } else {
            res.statusCode = 400;
            res.send(appToken+" is not valid . Please pass the valid A3 token ");
        }
    }

    else {
        res.statusCode = 400;
        res.send(appToken+" is not valid . Please pass the valid A3 token ");
    }
});

// Giga files app token - generation 
app.post('/gigafiles/api/v1/service/app-tokens',(req,res) => {

    //console.log(req.headers);

    //console.log(req.headers['x-a3-token']);

    if( typeof(req.headers['x-a3-token']) !== "undefined" && req.headers['x-a3-token'] !== "") {
        console.log(req.body);
        var gigaAppTokenResponse = {
    
        };
        gigaAppTokenResponse.token = crypto.randomBytes(32).toString('hex');
        res.send(gigaAppTokenResponse);

    } else {
        res.statusCode = 401;
        res.send("You are not authorized to generate token. Please check X-A3-Token header");
    }
   
});

// Giga files app token - validation and token info 

app.get('/gigafiles/api/v1/service/app-tokens/{appToken}',(req,res) => {

    console.log(req.body);
    var appTokenResponse = {
        "clientToken": "5696b220c414cba942b8b694b28d244e",
        "expiryTimeStamp": "11/30/2021 03:00:09 GMT",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
        "clientIP": "17.149.225.82"
      };
    res.send(appTokenResponse);
});


// giga files API's - Generate AppToken
/* app.post('/api/v1/service/app-tokens',(req,res) => {

    /*
    var response = {
        "token":"hjajjadkdskksdlfskdfsdjflsdfjksdlfksadflalsdfksadkfsd"
    }; */

 /*   var appTokenResponse = {

    };
    appTokenResponse.token = crypto.randomBytes(16).toString('hex');
    // generate random string using uuid API
    console.log(uuid.v4());
    // generate random string using crypto API
    //console.log(crypto.randomBytes(16).toString('hex'));
    console.log(req.body);
    res.send(appTokenResponse);
    //res.send(responsecrypto.randomBytes(16).toString('hex'));
});*/

// claim API's

//capabilitystatement-example
app.get('/claims/api/v1/capabilitystatement-example',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/capabilitystatement-example.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });

     
   
});

//http://build.fhir.org/patient-examples.html
// patient-example 
app.get('/claims/api/v1/patient-example',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-a 
app.get('/claims/api/v1/patient-example-a',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-a.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-a 
app.get('/claims/api/v1/patient-example-b',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-b.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-c 
app.get('/claims/api/v1/patient-example-c',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-c.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-d 
app.get('/claims/api/v1/patient-example-d',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-d.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-examples-general 
app.get('/claims/api/v1/patient-examples-general',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-examples-general.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-examples-cypress-template
app.get('/claims/api/v1/patient-examples-cypress-template',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-examples-cypress-template.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-xcda
app.get('/claims/api/v1/patient-example-xcda',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-xcda.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-xds
app.get('/claims/api/v1/patient-example-xds',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-xds.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-animal
app.get('/claims/api/v1/patient-example-animal',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-animal.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-animal
app.get('/claims/api/v1/patient-example-dicom',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-dicom.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-ihe-pcd
app.get('/claims/api/v1/patient-example-ihe-pcd',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-ihe-pcd.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-f001-pieter
app.get('/claims/api/v1/patient-example-f001-pieter',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-f001-pieter.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-f001-pieter
app.get('/claims/api/v1/patient-example-f001-pieter',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-f001-pieter.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});
// patient-example-f201-roel
app.get('/claims/api/v1/patient-example-f201-roel',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-f201-roel.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});
// patient-glossy-example
app.get('/claims/api/v1/patient-glossy-example',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-glossy-example.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});
// patient-example-proband
app.get('/claims/api/v1/patient-example-proband',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-proband.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-genetics-example1
app.get('/claims/api/v1/patient-genetics-example1',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-genetics-example1.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-chinese
app.get('/claims/api/v1/patient-example-chinese',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-chinese.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-newborn
app.get('/claims/api/v1/patient-example-newborn',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-newborn.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-mom
app.get('/claims/api/v1/patient-example-mom',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-mom.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-mom
app.get('/claims/api/v1/patient-example-mom',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-mom.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-infant-twin-1
app.get('/claims/api/v1/patient-example-infant-twin-1',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-infant-twin-1.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-infant-twin-2
app.get('/claims/api/v1/patient-example-infant-twin-2',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-infant-twin-2.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-infant-fetal
app.get('/claims/api/v1/patient-example-infant-fetal',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-infant-fetal.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});

// patient-example-infant-mom
app.get('/claims/api/v1/patient-example-infant-mom',(req,res) => {
    let data='';
    //res.contentType="application/json";
    http.get('http://build.fhir.org/patient-example-infant-mom.json', (resp) => {
        //let data = '';
        //console.log('guru');
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
        //console.log('guru');
          //console.log(data);
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader("Content-Type","applciation/json");
            res.send(data);
            //console.log(JSON.parse(data).explanation);
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
});


app.get('/',(req,res) => {
    res.send('Hello World');
});
app.listen(port,"0.0.0.0",()=>{
    console.log(`server started at ${port}`);
});
