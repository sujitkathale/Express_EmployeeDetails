import http from 'http';
import fs from 'fs';
import {parse} from 'querystring';


http.createServer((req,res)=>{
    let details = []
    let arrayOfStrings=[]
    function nullChecker(details) {
        return details.filter(x=>x!='')
    }
    if(req.url==="/" && req.method==='GET'){
        res.writeHead(200, {"Content-Type": "text/html"});
        let body=''
        fs.readFile("EmpDetails.txt",(err,data)=>{
            details=data.toString().split(`,`);
            details=nullChecker(details)
            console.log(details)
            details.map(data=>
                arrayOfStrings.push(parse(data))
                )
                    arrayOfStrings.map((emp,index) =>
                    body += `<tr><td >${index+1}</td><td >${emp.name}</td><td>${emp.email}</td><td>${emp.age}</td><td>${emp.city}</td><td>${emp.salary}</td></tr>`
                    )
            if(err) throw err;
            let empData = fs.readFileSync('index.html')
            res.write(` 
            ${empData}
               ${body}
               </tbody>
               </table>
            </body>
            </html>`)
            res.end();
            
        })
    }
   else if(req.url==="/addEmployee" && req.method==='GET'){
        res.writeHead(200,{'content-type':'text/html'})
        fs.readFile('addEmployee.html',(err,data)=>{
            if (err) throw err;
            res.write(data);
            res.end();
    })
    }
    else if(req.method==="POST"){
        req.on('data', (data) => {
           console.log(data.toString())
            fs.appendFile("EmpDetails.txt",data.toString()+',',(err)=>{
                if (err) throw err
                    res.end()  
                })
                res.writeHead(301, { "Location": "http://localhost:6677/" });
        });
    }
 
}).listen(6677)