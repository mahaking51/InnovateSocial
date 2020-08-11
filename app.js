var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/prodb', {useNewUrlParser: true})
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
var nodemailer = require('nodemailer');
const colors = ['00AA55', '009FD4', 'B381B3', '939393', 'E3BC00', 'D47500', 'DC2A2A'];
const i=0;
//forget password mailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'innovatesocial2023@gmail.com',
    pass: 'innovatedelta'
  }
});
//mongo schemas
const userSchema= new mongoose.Schema({
    username:String,
    pwd:String,
    firstname:String,
    lastname:String,
    email:String,
    followers:Array,
    following:Array,
    Desc:String
})
const projectSchema= new mongoose.Schema({
    title:String,
    content:String,
    members:Array,
    likes:Array,
    admin:String,
    contribution:Array,
    report:Array,
    complete:String
})
const chatSchema= new mongoose.Schema({
    roomid:String,
    user:String,
    message:String,
    time:String,
    date:String
})
const acceptSchema= new mongoose.Schema({
    id:String,
    heading:String,
    content:String,
    num:Number
})
const contributionSchema=new mongoose.Schema({
    name:String,
    date:String,
    num:Number
})
const notificationSchema=new mongoose.Schema({
    username:String,
    notify:String,
    read:String
})
const User =new mongoose.model('user',userSchema);
const Project=new mongoose.model('project',projectSchema);
const Chat=new mongoose.model('chat',chatSchema);
const Accept=new mongoose.model('accept',acceptSchema);
const Contribution=new mongoose.model('contribution',contributionSchema);
const Notification=new mongoose.model('notification',notificationSchema);

User.count(function (err, count) {
    if (!err && count === 0) {
        user =new User({
            username:'Maharajan',
            pwd:'*****',
            firstname:'maha',
            lastname:'innovate',
            email:'innovatesocial2023@gmail.com',
            followers:[],
            following:[],
            Desc:'Innovate,Explore and Inspire'
        })
        user.save()
    }
});
Project.count(function (err, count) {
    if (!err && count === 0) {

        project= new Project({
            title:'InnovateSocial',
            content:'Hi and Welcome to InnovateSocial, this website allows users to explore various fields of their interests by launching challenges/projects or by solving the challenges.This challenge is made inorder to make further devolopements to this site by user feedback.We have made this site considering to offer great user experience .So if u wish to make some changes to this site ,go ahead and join this project and start contributing ...<strong>Or if u wish to create your own challenge/project go to your dashboard(by clicking the user display picture on the top-right corner on the navigation bar) </strong> Good Luck!!!',
            members:[],
            likes:[],
            admin:'Maharajan',
            contribution:[],
            report:[],
            complete:'progress'
        })
        project.save();
    }
});

//landing page
app.get('/',function(req,res){
    res.render('cover',{});
})
//signup 
app.get('/signup',function(req,res){
res.render('signup',{});
})
//signin
app.get('/signin/:cond',function(req,res){

    res.render('signin',{condition:req.params.cond});
})
//userpage
app.get('/userpage/:name',function(req,res){
    r=Math.floor(Math.random() * 7); 
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=128&background="+colors[r]+"&color=FFFFFF"
    // link='/userpage/'+req.params.name;
    Project.find({},function(err,arr){
        res.render('userpage',{name:req.params.name,url:src,projects:arr,condfollow:false});
    })

})
//visit user profile
app.get('/visit/:user/:name',function(req,res){
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=128&background="+colors[i]+"&color=FFFFFF"

    Project.find({},function(err,arr){
        res.render('userpage',{name:req.params.name,user:req.params.user,url:src,projects:arr,condfollow:true});
    })

})
//home 
app.get('/home/:name',function(req,res){
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=45&background=ededed&color=272727"
    link='/userpage/'+req.params.name;
    Project.find({},function(err,arr){
        res.render('home',{name:req.params.name,link:link,dp:src,projects:arr});
    })
    
})
//chat
app.get('/chat/:id/:name',function(req,res){
    Chat.find({},function(err,arr){
        res.render('chat',{id:req.params.id,user:req.params.name,history:arr});
    })
})
//project content display
app.get('/project/:id/',function(req,res){
    Project.findOne({_id:req.params.id},function(err,obj){

    })
    Accept.find({id:req.params.id}).sort('num').exec(function(err,arr){
        res.render('project',{pid:req.params.id,project:arr})
        console.log(arr);
        
    })
    
})
//project report
app.get('/report/:id/:cond/:name',function(req,res){
    Accept.find({id:req.params.id},function(err,arr){
        res.render('report',{id:req.params.id,project:arr,condition:req.params.cond,user:req.params.name});
    })
})
//dropped projects 
app.get('/dropped/:name',function(req,res){
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=45&background=ededed&color=272727"
    link='/userpage/'+req.params.name;
    Project.find({complete:'dropped'},function(err,arr){
        res.render('dropped',{name:req.params.name,link:link,dp:src,len:arr.length});
    })
})
//completed projects
app.get('/complete/:name',function(req,res){
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=45&background=ededed&color=272727";
    link='/userpage/'+req.params.name;
    Project.find({complete:'completed'},function(err,arr){
        res.render('complete',{name:req.params.name,link:link,dp:src,len:arr.length});
    })
})
//forgot password page
app.get('/forgot',function(req,res){
    res.render('forgot',{});
})
//reset password
app.get('/reset/:id',function(req,res){
        res.render('reset',{id:req.params.id});
        
})
//new user 
app.post('/',function(req,res){
    user=new User({
        username:req.body.userName,
        pwd:req.body.password,
        email:req.body.email,
        firstname:req.body.fname,
        lastname:req.body.lname,
        followers:[],
        following:[],
        Desc:'Write Something about yourself'
    });
    User.find({username:req.body.userName},function(err,arr){
       
        if(!(arr.length>1)){
            console.log('saved');
            user.save();
        }
        
    })
    res.redirect('/signin/true')
    })
//user login
app.post('/signin',function(req,res){
    User.find({username:req.body.userName},function(err,arr){
        if(err)console.log(err);
        else{
            if(arr.length==0){
                res.redirect('/signin/false')
  
            }
            else{
                if(arr[0].pwd===req.body.pwd){
                    res.redirect('/home/'+req.body.userName);
                }
                else{
                    res.redirect('/signin/false')
                }
            }
            
        }
    })
})
//project publish 
app.post('/publish',function(req,res){
project= new Project({
    title:req.body.heading,
    content:req.body.content,
    members:[],
    admin:req.body.submit,
    contribution:[],
    complete:'progress'
});
project.save();
res.redirect('/home/'+req.body.submit);

})

app.post('/home/:name',function(req,res){
    res.redirect('/home/'+req.params.name);
})
app.post('/reset',function(req,res){
    if(req.body.password===req.body.confirm){
        User.updateOne({_id:req.body.submit},{$set:{pwd:req.body.password}},function(err,succ){

        })
    }
    res.redirect('/signin/true')
    
})
//loading users and sending it to the client
app.get('/users',function(req,res){
    a=[];
    User.find({},function(err,arr){
        if(err){
            console.log(err);
        }
        else{
            for(var i=0;i<arr.length;i++){
                var obj={
                    userName:arr[i].username,
                    password:arr[i].pwd,
                    email:arr[i].email
                }
                a.push(obj);
            }
            res.send(a);
        }
    })
});
//loading project and sending it to the client
app.get('/projects',function(req,res){
    a=[]
    Project.find({},function(err,arr){
        if(err)console.log(err);
        else{
            for(var i=0;i<arr.length;i++){
                obj={
                    id:arr[i]._id,
                    title:arr[i].title,
                    content:arr[i].content,
                    admin:arr[i].admin,
                    likes:arr[i].likes,
                    members:arr[i].members,
                    complete:arr[i].complete
                }
                a.push(obj);
            }
            res.send(a);
        }
    })
})
//socket connections
io.on('connection', function(socket) {
    io.sockets.emit('test','ready!!');
    //likes
    socket.on('like',function(data){
        Project.updateOne({_id:data.id},{$push:{likes:data.name}},function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        });
    })
    //project joining 
    socket.on('joining',function(data){
        Project.updateOne({_id:data.id},{$push:{members:data.name}},function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
        Project.findOne({_id:data.id},function(err,obj){
            socket.emit('members',{memb:obj.members});
        })        
    })
    //contributing
    socket.on('contribute',function(data){
        obj={
            num:data.num,
            name:data.auth,
            heading:data.head,
            content:data.content,
        }
    Project.updateOne({_id:data.project},{$push:{contribution:obj}},function(err,succ){
        if(err)console.log(err);
            else{console.log(succ);}
    })
    today =new Date()
    Contribution.find({name:data.auth,date:today.toLocaleDateString()},function(err,arr){
        if(arr.length==0){
            contribution =new Contribution({
                name:data.auth,
                date:today.toLocaleDateString(),
                num:1
            })
            contribution.save();
        }    
        else{
            Contribution.updateOne({name:data.auth,date:today.toLocaleDateString()},{$inc:{num:1}},function(err,succ){

            })
        }
    })
        
    })
    //contribution getting accepted by the admin
    socket.on('change',function(data){
        
        console.log(data);
        
        Accept.find({id:data.project},function(err,arr){
            accept =new Accept({
                id:data.project,
                heading:data.heading,
                content:data.content,
                num:arr.length
            })
            accept.save();
        })
        today =new Date()
        Contribution.find({name:data.name,date:today.toLocaleDateString()},function(err,arr){
            if(arr.length==0){
                contribution =new Contribution({
                    name:data.name,
                    date:today.toLocaleDateString(),
                    num:1
                })
                contribution.save();
            }    
            else{
                Contribution.updateOne({name:data.name,date:today.toLocaleDateString()},{$inc:{num:1}},function(err,succ){
    
                })
            }
        })
        

    })
    socket.on('acceptance',function(data){
        Accept.find({id:data.id},function(err,arr){

        accept =new Accept({
            id:data.id,
            heading:data.heading,
            content:data.content,
            num:arr.length
        })
        accept.save();
        })
        obj={
            name:data.user,
            content:data.content
        }
        
        Project.updateOne({_id:data.id},{ $pull: { contribution: {  num:data.num} } },function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
    })
    //contirbution getting declined
    socket.on('decline-idea',function(data){
        obj={
            name:data.user,
            content:data.content
        }
        console.log(data);

        Project.updateOne({_id:data.id},{ $pull: { contribution: { name:data.user, num:data.num} } },function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
    })
    socket.on('check',function(data){
        console.log();
        User.findOne({username:data.user},function(err,obj){
            socket.emit('return',{details:obj});
        })
    })
    //followers and following
    socket.on('follow',function(data){
        User.updateOne({username:data.user},{$push:{following:data.name}},function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
        User.updateOne({username:data.name},{$push:{followers:data.user}},function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
    })
    //user joining chat
    socket.on('joinChat',function(data){
        socket.join('room-'+data.id);
        Project.findOne({_id:data.id},function(err,obj){
        io.sockets.in('room-'+obj.id).emit('roomConnection',obj);
        })
    })
    //real-time chatting and saving chat to the database
    socket.on('chat',function(data){
        chat = new Chat({
            user:data.user,
            roomid:data.id,
            message:data.message,
            time:data.time,
            date:data.date
        })
        chat.save();
        socket.in('room-'+data.id).broadcast.emit('other',data);
    })
    a=[]
    complete=[];
    dropped=[];
    Project.find({},function(err,arr){
        if(err)console.log(err);
        else{
            for(var i=0;i<arr.length;i++){
                obj={
                    id:arr[i]._id,
                    title:arr[i].title,
                    content:arr[i].content,
                    admin:arr[i].admin,
                    likes:arr[i].likes,
                    members:arr[i].members,
                    complete:arr[i].complete
                }
                if(arr[i].complete==='progress'){
                a.push(obj);
                }
                else if(arr[i].complete==='completed'){
                    complete.push(obj);
                }
                else if(arr[i].complete==='dropped'){
                    dropped.push(obj);
                }
            }
        }
        socket.emit('load',a);
        
        io.sockets.emit('dropped-project',dropped);


    })
    //report data
    socket.on("loadreport",function(data){
        Accept.find({id:data}).sort('num').exec(function(err,arr){
            socket.emit("loading",arr);
        })
        Project.findOne({_id:data},function(err,obj){
            socket.emit('title-edit',obj)
        })
    })
    //saving edited report
    socket.on('edit-report',function(data){
        Accept.updateOne({_id:data.id},{heading:data.heading,content:data.content},function(err,succ){

        })
    })
    //allows the user to make customised reports
    socket.on('delete',function(data){
        Accept.deleteOne({_id:data.id},function(err,succ){
            if(err)console.log(err);
            else{console.log(succ);}
        })
        Accept.findOne({_id:data.id},function(err,obj){
            Accept.update({id:data.pid,num:{$gt:obj.num}},{$inc:{num:-1}},function(err,succ){

            });
        })
        
    })
    socket.on('reportMaking',function(data){
        console.log(data);
        
        Accept.find({id:data}).sort('num').exec(function(err,docs){
            socket.emit('reportDetails',docs);
        })
        Project.findOne({_id:data},function(err,obj){
            socket.emit('title',obj)
        })
    })
    socket.on('sendData',function(data){
    Project.updateOne({_id:data.id},{$set:{'report':[]}},function(err,succ){
        if(err)console.log(err);
        else{console.log(succ);}
    })
    Project.updateOne({_id:data.id},{$push:{report:data.obj}},function(err,succ){
        if(err)console.log(err);
        else{console.log(succ);}
    })
    console.log(data);
    
    for(var i=0;i<data.obj.idacc.length;i++){
        Accept.updateOne({_id:data.obj.idacc[i]},{$set:{"num":i}},function(err,succ){

        })
        console.log(data.obj.idacc[i]);
        
        
    }
    })
    //user contribution graph data updation
    socket.on('chart',function(data){
        Contribution.find({name:data},function(err,arr){
            socket.emit('chartData',arr);
        })
    })
    //dropping project 
    socket.on('dropProject',function(data){
    console.log(data);
        
    Project.updateOne({_id:data.pid},{$set:{complete:'dropped'}},function(err,succ){

    })
    Project.updateOne({_id:data.pid},{$set:{members:[]}},function(err,succ){

    })
    Project.updateOne({_id:data.pid},{$set:{admin:''}},function(err,succ){

    })
})        
//completion of project
    socket.on('complete',function(data){
        Project.updateOne({_id:data.pid},{$set:{complete:'completed'}},function(err,succ){
            
        })
        Project.updateOne({_id:data.pid},{$set:{admin:''}},function(err,succ){

        })    
    })
    Project.find({complete:'dropped'},function(err,arr){
        console.log(arr);
        
    })
    //taking over dropped project 
    socket.on('take-over',function(data){
        Project.updateOne({_id:data.pid},{$set:{complete:'progress'}},function(err,succ){
            
        })
        Project.updateOne({_id:data.pid},{$set:{admin:data.admin}},function(err,succ){
            
        })
    })
    socket.on('value',function(data){
        console.log(data);
        Project.find({complete:'completed'},function(err,arr){
            socket.emit('load-complete',arr);
        })

    })
    //sending link for resetting pwd through email
    socket.on('forgot',function(data){

        if(data.username!='' && data.email!=''){
            User.find({username:data.username,email:data.email},function(err,arr){
                if(arr.length===1){
                    var mailOptions = {
                        from: 'innovatesocial2023@gmail.com',
                        to: data.email,
                        subject: 'Reset password',
                        html: '<p>We heard that you lost your ScienceHub password. Sorry about that!But don’t worry! You can use the following <a href="http://localhost:3000/reset/'+arr[0]._id+'">link</a> to reset your password:</p>'
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                      socket.emit('success',{});
                }
                else{
                    socket.emit('invalidcredential',{})
                }
            })
        }
        else{
            socket.emit('invalidcredential',{})
        }
    })
    socket.on('userfind',function(data){
        User.findOne({_id:data},function(err,obj){
            socket.emit('founduser',obj.username);
        })
    })
    //allows user to leave the project 
    socket.on('leave',function(data){
        Project.updateOne({_id:data.pid},{$pull:{members:data.user}},function(err,succ){
            if(err){
                console.log(err);
            }
        })
    })
    //editting personal description
    socket.on('profileEdit',function(data){
        User.updateOne({username:data.name},{$set:{Desc:data.desc}},function(err,succ){
            if (err){
                console.log(err);
            }
        })
    })
    //updating notification (real-time)
    socket.on('joinroom',function(data){
        socket.join('room-'+data)
        console.log('room joined');
    })
    socket.on('notifyUser',function(data){
                if(data.status==='accept'){
                    io.sockets.in('room-'+data.name).emit('notify','Your content got accepted by '+data.user)    
                }
                else{
                    io.sockets.in('room-'+data.name).emit('notify','Your content got rejected by '+data.user)    
                }
    })
    socket.on('acceptNotify',function(data){
        notification=new Notification({
            username:data.username,
            notify:data.noti,
            read:'false'

        })
        notification.save();
    })
    socket.on('decNotify',function(data){
        notification=new Notification({
            username:data.username,
            notify:data.noti,
            read:'false'
        })
        notification.save();
    })
    socket.on('contriNotify',function(data){
        console.log(data);
        Project.findOne({_id:data.pid},function(err,obj){
            io.sockets.in('room-'+obj.admin).emit('refreshnoti','You might have some ideas refresh the page to view them')
            console.log(obj.admin);
        })
    })
    socket.on('loadNotification',function(data){
        console.log('loading Notification...');
        n=0
        Notification.find({username:data,read:'false'},function(err,arr){
            n=n+arr.length;
            socket.emit('outNotification',{array:arr,n:n});
            
        })

    })
    socket.on('loadContri',function(data){
        Project.find({admin:data},function(err,arr){
            n=0
            for(var i=0;i<arr.length;i++){
                n=n+arr[i].contribution.length
            }
            socket.emit('contrivalue',n)
        })

    })
    //mark read notification 
    socket.on('readnotification',function(data){
        Notification.updateOne({_id:data},{$set:{read:'true'}},function(err,succ){

        })
    })
    })


http.listen(3000, function() {
    console.log('listening on *:3000');
 });