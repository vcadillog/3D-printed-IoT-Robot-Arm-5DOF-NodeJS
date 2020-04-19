var ctx = document.getElementById("ctx").getContext("2d");
var Img = {};

Img.joystick = new  Image();  
Img.open = new Image();
Img.close = new Image();    
Img.joystick_x_neg_pushed = new  Image();
Img.joystick_x_pos_pushed = new  Image();
Img.joystick_y_neg_pushed = new  Image();
Img.joystick_y_pos_pushed = new  Image();
Img.joystick_z_neg_pushed = new  Image();
Img.joystick_z_pos_pushed = new  Image();
Img.open_pushed = new Image();
Img.close_pushed = new Image();

Img.joystick.src = "/images/controls/joystick.png";    
Img.open.src =  "/images/controls/open.png";  
Img.close.src =  "/images/controls/close.png";  
Img.joystick_x_neg_pushed.src =  "/images/controls/joystick_x_neg.png";  
Img.joystick_x_pos_pushed.src = "/images/controls/joystick_x_pos.png";
Img.joystick_y_neg_pushed.src = "/images/controls/joystick_y_neg.png";
Img.joystick_y_pos_pushed.src = "/images/controls/joystick_y_pos.png";
Img.joystick_z_neg_pushed.src = "/images/controls/joystick_z_neg.png";
Img.joystick_z_pos_pushed.src = "/images/controls/joystick_z_pos.png";
Img.open_pushed.src = "/images/controls/open_pushed.png";
Img.close_pushed.src = "/images/controls/close_pushed.png";
   
ctx.font = '30px Arial';

var socket = io();

socket.on('newPosition',function(data){     
    ctx.clearRect(0,0,960,540);
    ctx.drawImage(Img.joystick,100,300,150,150);
    ctx.drawImage(Img.open,700,330,100,100);
    ctx.drawImage(Img.close,800,330,100,100);
    ctx.fillStyle = "#ff0000";  
    ctx.fillText('X: '+data.x.toFixed(2), 430, 310);
    ctx.fillText('Y: '+data.y.toFixed(2), 430, 360);
    ctx.fillText('Z: '+data.z.toFixed(2), 430, 405);
    ctx.fillText('G: '+data.g.toFixed(2), 430, 450);  

});

socket.on('OutOfRange', function(data){
        ctx.fillText('INVALID POSITION', 380, 200);
        ctx.fillText('OUT OF LIMITS, STOPPED', 350, 250);
});



document.onkeydown = function(event){
    if(event.keyCode == 68)
    {
        ctx.drawImage(Img.joystick_x_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'x_pos',state:true});
    }   
    else if(event.keyCode == 65)
    {   ctx.drawImage(Img.joystick_x_neg_pushed,100,300,150,150);            
        socket.emit('keyPress',{inputId:'x_neg',state:true});            
    }        
    else if(event.keyCode == 87)
    {   ctx.drawImage(Img.joystick_y_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'y_pos',state:true});          
    }
    else if(event.keyCode == 83)
    {   
        ctx.drawImage(Img.joystick_y_neg_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'y_neg',state:true});
    }
    else if(event.keyCode == 81)
    {   
        ctx.drawImage(Img.joystick_z_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'z_pos',state:true});            
    }
    else if(event.keyCode == 69)
    {   
        ctx.drawImage(Img.joystick_z_neg_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'z_neg',state:true});            
    }     
    else if(event.keyCode == 79)
    {   ctx.drawImage(Img.open_pushed,700,330,100,100);            
        socket.emit('keyPress',{inputId:'open_gripper',state:true});            
    }
    else if(event.keyCode == 80)
    {   ctx.drawImage(Img.close_pushed,800,330,100,100);            
        socket.emit('keyPress',{inputId:'close_gripper',state:true});            
    }                           
}

document.onkeyup = function(event){
    if(event.keyCode == 68)
    {
        ctx.drawImage(Img.joystick_x_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'x_pos',state:false});
    }   
    else if(event.keyCode == 65)
    {   ctx.drawImage(Img.joystick_x_neg_pushed,100,300,150,150);            
        socket.emit('keyPress',{inputId:'x_neg',state:false});            
    }        
    else if(event.keyCode == 87)
    {   ctx.drawImage(Img.joystick_y_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'y_pos',state:false});          
    }
    else if(event.keyCode == 83)
    {   
        ctx.drawImage(Img.joystick_y_neg_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'y_neg',state:false});
    }
    else if(event.keyCode == 81)
    {   
        ctx.drawImage(Img.joystick_z_pos_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'z_pos',state:false});            
    }
    else if(event.keyCode == 69)
    {   
        ctx.drawImage(Img.joystick_z_neg_pushed,100,300,150,150);
        socket.emit('keyPress',{inputId:'z_neg',state:false});            
    }     
    else if(event.keyCode == 79)
    {   ctx.drawImage(Img.open_pushed,700,330,100,100);
        socket.emit('keyPress',{inputId:'open_gripper',state:false});            
    }
    else if(event.keyCode == 80)
    {   ctx.drawImage(Img.close_pushed,800,330,100,100);            
        socket.emit('keyPress',{inputId:'close_gripper',state:false});            
    }                           
}
