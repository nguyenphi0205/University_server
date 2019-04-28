var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors')
//start mysql connection
var connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-02.cleardb.net', //mysql database host name
  user: 'b8af98308f6823', //mysql database user name
  password: '92c9542c', //mysql database password
  database: 'heroku_e5ed3ef6022bc7e' //mysql database name
});

connection.connect(function (err) {
  if (err) throw err
  console.log('You are now connected...')
})
//end mysql connection

//start body-parser configuration
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration
app.use(cors())
//create app server
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log("server listen up "+ PORT)
})
// var server = app.listen(3000, "127.0.0.1", function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log("Example app listening at http://%s:%s", host, port)

// });
//rest api get user by role
app.get('/api/users', function (req, res) {
  connection.query('select user.User_ID,user.Email,Password,user.First_Name,user.Last_Name,role.Role_Name FROM user join user_has_role on user.User_ID = user_has_role.User_ID join role on user_has_role.Role_ID = role.Role_ID', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

// rest api get list faculty
app.get('/api/faculty', function (req, res) {
  connection.query('select * from faculty', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to get all results
app.get('/api/cloursedate', function (req, res) {
  connection.query('select * from cloursedate', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//rest api to create a new record into mysql database
app.post('/api/files', function (req, res) {
  var postData = req.body;
  connection.query('INSERT INTO file SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    else {
      res.end(JSON.stringify(results));
    }
  });
});
//add comment
app.post('/api/comment', function (req, res) {
  var postData = req.body;
  connection.query('INSERT INTO comment SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    else {
      res.end(JSON.stringify(results));
    }
  });
});

//rest api to get a single faculty data
app.get('/api/faculty/:id', function (req, res) {
  console.log(req);
  connection.query('select faculty.Faculty_ID, Faculty_Name from faculty join faculty_has_customer on faculty.Faculty_ID = faculty_has_customer.Faculty_ID join user on user.User_ID = faculty_has_customer.User_ID where user.User_ID=?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get api to get faculty ID from User
app.get('/api/facultyID/:id', function (req, res) {
  console.log(req);
  connection.query('select faculty.Faculty_ID from faculty join faculty_has_customer on faculty.Faculty_ID = faculty_has_customer.Faculty_ID join user on user.User_ID = faculty_has_customer.User_ID where user.User_ID=?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get file by student
app.get('/api/getFile/:id', function (req, res) {
  console.log(req);
  connection.query('select file.File_ID,file.File_Name, file.DateCreate, file.LinkDown,file.status, faculty.Faculty_Name  from file join faculty on file.Faculty_ID= faculty.Faculty_ID where file.Customer_ID =? order by DateCreate desc', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get file download by File_Id
app.get('/api/getFileDowload/:id', function (req, res) {
  console.log(req);
  connection.query('select LinkDown from file where File_ID =?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//rest api to update file into mysql database
app.put('/api/UpdateFile', function (req, res) {
  connection.query('UPDATE `file` SET `File_Name`=?,`DateCreate`=?,`LinkDown`=?,`Status`=? Where `File_ID`=?', [req.body.File_Name, req.body.DateCreate, req.body.LinkDown, req.body.Status, req.body.File_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//rest api to update user into mysql database
app.put('/api/UpdateUser', function (req, res) {
  connection.query('UPDATE `user` SET `First_Name`=?,`Last_Name`=?,`Email`=?,`Password`=? Where `User_ID`=?', [req.body.First_Name, req.body.Last_Name, req.body.Email, req.body.Password, req.body.User_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to change password into mysql database
app.put('/api/ChangePassword', function (req, res) {
  connection.query('UPDATE `user` SET `Password`=? Where `User_ID`=?', [req.body.Password, req.body.User_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//
app.get('/api/getComment/:id', function (req, res) {
  console.log(req);
  connection.query('select * from comment where File_ID =?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get faculti
//get list file for coordinator
app.get('/api/getFileForCoordinator/:id', function (req, res) {
  console.log(req);
  connection.query('select file.File_ID,file.File_Name, file.DateCreate, file.LinkDown,file.status, faculty.Faculty_Name  from file join faculty on file.Faculty_ID= faculty.Faculty_ID where file.Faculty_ID =? order by DateCreate desc', [req.params.id,], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//api approve file
app.put('/api/ApproveFile', function (req, res) {
  connection.query('UPDATE `file` SET `Status`=? Where `File_ID`=?', [req.body.Status, req.body.File_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get list file for manager
app.get('/api/getFileForManager/', function (req, res) {
  console.log(req);
  connection.query('select file.File_ID,file.File_Name, file.DateCreate, file.LinkDown,file.status, faculty.Faculty_Name  from file join faculty on file.Faculty_ID= faculty.Faculty_ID  where file.Status in (?,?,?) order by DateCreate desc;', ['approve', 'reject', 'public'], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to update record into mysql database
app.put('/employees', function (req, res) {
  connection.query('UPDATE `employee` SET `employee_name`=?,`employee_salary`=?,`employee_age`=? where `id`=?', [req.body.employee_name, req.body.employee_salary, req.body.employee_age, req.body.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//get comment for admin 
app.get('/api/getCommentForManager/:id', function (req, res) {
  console.log(req);
  connection.query('select * from comment join user on comment.Customer_ID =user.User_ID join user_has_role on user.User_ID = user_has_role.User_ID join role on role.Role_ID = user_has_role.Role_ID where comment.File_ID =?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
// statistic 
app.get('/api/pieChart', function (req, res) {
  connection.query('select faculty.Faculty_Name as name ,count(file.File_ID) as value from file join faculty on file.Faculty_ID = faculty.Faculty_ID group by faculty.Faculty_ID', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
app.get('/api/BarChart/', function (req, res) {
  console.log(req);
  connection.query('select faculty.Faculty_Name as Name,count(user.User_ID) as pv from  user join faculty_has_customer on user.User_ID = faculty_has_customer.User_ID join faculty on faculty.Faculty_ID= faculty_has_customer.Faculty_ID join user_has_role on user.User_ID = user_has_role.User_ID where user_has_role.Role_ID =? group by faculty.Faculty_ID ', [2], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
//api get file by guess
app.get('/api/GuessFile/:id', function (req, res) {
  console.log(req);
  connection.query('select file.File_ID,file.File_Name, file.DateCreate, file.LinkDown,file.status, faculty.Faculty_Name from file join faculty  on faculty.Faculty_ID=file.Faculty_ID where file.Status =? and faculty.Faculty_ID=?', ['public', req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});
