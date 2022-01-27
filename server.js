const express=require('express');
const port=8888;
const fs=require('fs')
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    let arrayOfStrings=[]
        res.writeHead(200,{'content-type':'text/html'})
        let body=''
        fs.readFile("EmpDetails.txt",(err,data)=>{
            arrayOfStrings=(JSON.parse(data))
                    arrayOfStrings.map((emp,index) =>
                    body += `<tr><td >${index+1}</td><td >${emp.name}</td><td>${emp.email}</td><td>${emp.age}</td><td>${emp.city}</td><td>${emp.salary}</td><td><a href="/delete/${index}" class="btn btn-danger">Delete</a> <a href="/update/${index}" class="btn btn-danger">Update</a></td></tr>`
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
})

app.get('/addEmployee',(req,res)=>{
    res.sendFile('addEmployee.html',{root:'.'})
})
app.post('/submit_data',(req,res)=>{
    let arr=[]
    fs.readFile('Empdetails.txt',(err,data)=>{
        if(err) throw err
        arr=JSON.parse(data)
        arr.push(req.body)
       fs.writeFile("Empdetails.txt",`${JSON.stringify(arr)}`,(err)=>{
           if(err) throw err
           res.end()
       })
    })
   
   res.writeHead(302, { 'Location':" http://localhost:8888/" });
})

app.get("/delete/:id", function(req, res) {
    let a=[];
   fs.readFile('Empdetails.txt',(err,data)=>{
       if(err) throw err;
       a=JSON.parse(data)
        a.splice(req.params.id,1)
        console.log(a)
        fs.writeFile('Empdetails.txt',`${JSON.stringify(a)}`,(err)=>{
        if (err) throw err;
        res.end()
    })
})
res.redirect('back');
  });

app.get("/update/:id", function(req, res) {
    let details=[]
    const id=req.params.id
    // res.sendFile('updateEmployee.html',{root:'.'})
  fs.readFile('Empdetails.txt',(err,data)=>{
    details=JSON.parse(data)
    res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <title>Document</title>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="http://localhost:8888/">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" href="/addEmployee">Add Employee</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        <form method="post" class="m-3" action='/update_data'>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Your Name</label>
              <input type="text" class="form-control" name="name" id="exampleInputEmail1" value=${details[id].name}>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Email Address</label>
              <input type="email" class="form-control"  name="email" value=${details[id].email} >
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Age</label>
              <input type="number" class="form-control"  name="age" value=${details[id].age} >
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">City</label>
              <input type="text" class="form-control"  name="city" value=${details[id].city} >
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Salary</label>
              <input type="number" class="form-control"  name="salary" value=${details[id].salary} >
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
          </form>
    </body>
    </html>`)
    res.end()
     app.post('/update_data',(req,res)=>{
        details[id].name=req.body.name
        details[id].email=req.body.email
        details[id].age=req.body.age
        details[id].city=req.body.city
        details[id].salary=req.body.salary;
        data=details
        fs.writeFile('Empdetails.txt',`${JSON.stringify(data)}`,(err)=>{
            if (err) throw err;
            res.end()
        })
        res.writeHead(302, { 'Location':" http://localhost:8888/" });
    })
  
})
})

  
app.listen(port,(err)=>{
    if (err) throw err;
    console.log(`working on ${port}`)
})