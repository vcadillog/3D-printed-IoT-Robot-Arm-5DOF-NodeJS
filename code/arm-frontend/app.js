var hostname = 'Your-IP-direction';
var PORT = 8080;
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var matrix = require('node-matrix');
var path = require('path')
//RTSP
var Stream = require('node-rtsp-stream')
stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp:Your-RTSP-Direction',
  wsPort: 3000,
  ffmpegOptions: { // options ffmpeg flags  
    '-stats': '-nostats', // an option with no neccessary value uses a blank string
    '-r': 25,// options with required values specify the value after the key
    '-s':'960x540'

  }
})

app.get('/',function(req,res){
    app.use(express.static(path.join(__dirname + '/client')));
    res.sendFile(__dirname + '/client/index.html');
});


serv.listen(PORT, hostname);
console.log("Server started")

var SOCKET_LIST = {};
var USER_LIST = {};

var HomogeneusTransformation = function(a,d,alpha,theta){
    return matrix([[Math.cos(theta), -Math.sin(theta)*Math.cos(alpha), Math.sin(theta)*Math.sin(alpha), a*Math.cos(theta)],
    [Math.sin(theta), Math.cos(theta)*Math.cos(alpha) ,-Math.cos(theta)*Math.sin(alpha), a*Math.sin(theta)],
    [0 , Math.sin(alpha), Math.cos(alpha), d], 
    [0 , 0, 0, 1]]);
};

var DHValues = function(){
    var self={
        a1:18,
        a2:-15,
        Lb:46,
        L1:24,
        L2:52,
        L3:34,
        L4:60,
        L5:33,     
        theta1:0,
        theta2:0,
        theta3:0,
        theta4:0,
        theta5:1,
    }
    return self;
};
var DH  = DHValues();
var A_1 = HomogeneusTransformation(DH.a1,DH.L1+DH.Lb,Math.PI/2,DH.theta1);
var A_2 = HomogeneusTransformation(DH.L2,DH.a2,0,DH.theta2);
var A_3 = HomogeneusTransformation(DH.L3,0,0,DH.theta3);
var A_4 = HomogeneusTransformation(DH.L4,0,Math.PI/2,DH.theta4);
var A_5 = HomogeneusTransformation(0,DH.L5,0,DH.theta5);

var  T2 = matrix.multiply(A_1,A_2);
var  T3 = matrix.multiply(T2,A_3);
var  T4 = matrix.multiply(T3,A_4);
var  T5 = matrix.multiply(T4,A_5);

var InverseKinematics = function(){
    var self = {
    theta1: DH.theta1,
    theta2: DH.theta2,
    theta3: DH.theta3,
    theta4: DH.theta4,   
    }
    self.updateJoints = function(x,y,z){
        var phi = 0;
        var beta = Math.asin(Math.abs(DH.a2)/(x**2 + y**2)**0.5);        
        var q_1 = Math.atan2(y,x) - beta;
        var z3 = z + DH.L5*Math.cos(phi) + DH.L4*Math.sin(phi);        
        var x3a = ((x**2 +y**2 - DH.a2**2)**0.5 - DH.L5*Math.sin(phi) - DH.L4*Math.cos(phi));        
        var q_3 = Math.acos( ((x3a -DH.a1)**2 + (z3-DH.L1-DH.Lb)**2 - DH.L2**2 - DH.L3**2)/(2*DH.L2*DH.L3) - 0.1**10);
        var cosq_2 = ((DH.L2+DH.L3*Math.cos(q_3))*(x3a -DH.a1) + DH.L3*Math.sin(q_3)*(z3-DH.L1-DH.Lb))/((x3a - DH.a1)**2 + (z3 - DH.L1 - DH.Lb)**2);
        var sinq_2 = ((DH.L2+DH.L3*Math.cos(q_3))*(z3 - DH.L1 - DH.Lb) + DH.L3*Math.sin(q_3)*(x3a - DH.a1))/((x3a - DH.a1)**2 + (z3 - DH.L1 - DH.Lb)**2);
        var q_2 = Math.atan(sinq_2/cosq_2);
        var q_4 = phi - q_3 - q_2;      
        self.theta1 = + q_1.toFixed(5);
        self.theta2 = +q_2.toFixed(5) ;
        self.theta3 = +q_3.toFixed(5);
        self.theta4 = +q_4.toFixed(5);
    }
    return self;
};

var User = function(id){
    var self ={
        x:0,
        y:0,
        z:0,
        g:0,        
        id:id,
        pressingXpos:false,
        pressingXneg:false,
        pressingYpos:false,
        pressingYneg:false,
        pressionZpos:false,
        pressingZneg:false,
        pressingOpen:false,
        pressingClose:false,
        maxSpd:2,
	SpdG:0.1,
    }
    self.updatePosition = function(){
        if(self.pressingXpos)
            self.x += self.maxSpd;
        if(self.pressingXneg)
            self.x -= self.maxSpd;
        if(self.pressingYpos)
            self.y += self.maxSpd;
        if(self.pressingYneg)
            self.y -= self.maxSpd;
        if(self.pressingZpos)
            self.z += self.maxSpd;
        if(self.pressingZneg)
            self.z -= self.maxSpd;
        if(self.pressingOpen)
            self.g += self.SpdG;
        if(self.pressingClose)
            self.g -= self.SpdG;
    }
    return self;
};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id  = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var user = User(socket.id);
    console.log(user);
    USER_LIST[socket.id] = user;

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete USER_LIST[socket.id];
    });
    socket.on('keyPress',function(data){
        if(data.inputId == 'x_pos')
            user.pressingXpos = data.state;
        else if(data.inputId == 'x_neg')
            user.pressingXneg = data.state;
        else if(data.inputId == 'y_pos')
            user.pressingYpos = data.state;
        else if(data.inputId == 'y_neg')
            user.pressingYneg = data.state;            
        else if(data.inputId == 'z_pos')
            user.pressingZpos = data.state;
        else if(data.inputId == 'z_neg')
            user.pressingZneg = data.state;
        else if(data.inputId == 'open_gripper')
            user.pressingOpen = data.state;
        else if(data.inputId == 'close_gripper')
            user.pressingClose = data.state;            
    });
    });


setInterval(function(){    

    var newDistance={
        x:T5[0][3],
        y:T5[1][3],
        z:T5[2][3],
	g:DH.theta5,
    };
    var newAngles={
        theta1: DH.theta1,     
        theta2: DH.theta2,
        theta3: DH.theta3,
        theta4: DH.theta4,
        g:DH.theta5,
	waste:0,	//To generate a commma for the arduino code
	};
    var IK = InverseKinematics()     
       
    for(var i in USER_LIST){
        var user = USER_LIST[i];
        newDistance.x +=user.x;
        newDistance.y +=user.y;
        newDistance.z +=user.z;
        newDistance.g +=user.g;
        user.updatePosition();                     
    }   
    IK.updateJoints(newDistance.x,newDistance.y,newDistance.z);


    newAngles.theta1 = IK.theta1;
    newAngles.theta2 = IK.theta2;
    newAngles.theta3 = IK.theta3;
    newAngles.theta4 = IK.theta4;
    newDistance.x = +newDistance.x.toFixed(5);
    newDistance.y = +newDistance.y.toFixed(5);
    newDistance.z = +newDistance.z.toFixed(5);
    newDistance.g = +newDistance.g.toFixed(5);
    newAngles.g = newDistance.g;

    for ( var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition',newDistance);  
	if (isNaN(newAngles.theta1) == true || isNaN(newAngles.theta2) == true || isNaN(newAngles.theta3) == true || isNaN(newAngles.theta4) == true){
	   socket.emit('OutOfRange', 0);
	}
	else{
	  socket.emit('newAngles',newAngles);         
	}
    }; 
},1000/25);
