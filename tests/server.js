const http = require('http');

const Port = 3000;

const app = http.createServer((req, res) => {
    // console.log(req);
    // console.log(req.url);

    if (req.url == '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(homepage);
        return res.end();
    }

    if (req.url == '/users') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(userlist);
        return res.end();

    }

    if (req.url == '/create-user' & req.method == 'POST') {
        console.log(req.body)
        // let username = 
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(user_created(username));
        return res.end();

    }

    res.writeHead(404, { "Content-Type": "text/html" });
    res.write(`<center><h1>OOp's !! Wrong URL... </h1><p>What do you want buddy ??</p></center>`);
    return res.end();

});

app.listen(Port, () => console.log(`Application is running on ${Port}`));


var userlist = `
<!DOCTYPE html>
<html>
<head>
  <title>User List</title>
</head>
<body>
  <h2>List of Users</h2>
  <ul>
    <li>Aarav Sharma</li>
    <li>Isha Patel</li>
    <li>Rohan Mehta</li>
    <li>Sneha Desai</li>
    <li>Vikram Joshi</li>
  </ul>
</body>
</html>
`

var homepage = `
<!DOCTYPE html>
<html>
<head>
  <title>User List</title>
</head>
<body>
 <center>
    <h1> Hello This is Test server for assignment running port ${Port}</h1>
    <p>Welcome to Home Page</p>
    <br/>
    <br/>
    <br/>
    <form action='/create-user' method='post'>
        <h2> Know your User </h2>
        <input required placeholder='Enter a User Name' />
        <button> Submit </button>
    </form>
 </center>
</body>
</html>
`

var user_created = (username) => `
<!DOCTYPE html>
<html>
<head>
  <title>Thank You</title>
</head>
<body>
  <h2>Thank You!</h2>
  <p>Your username [ ${username} ] has been successfully added.</p>
</body>
</html>
`