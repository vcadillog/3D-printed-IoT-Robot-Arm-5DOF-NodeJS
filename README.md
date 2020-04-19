# OPEN-SOURCE-5DOF-IOT-ROBOT-ARM

Fully developed Robot Arm with a web app for a educational purpose in robotics and programming, using an IP camera, 3D printing, Arduino and NodeJS.

## MATERIALS REQUIRED

* 3D printer
* WiFi connection.
* A computer as a Web Server (can be used a Raspberry PI) with NodeJS installed.
* IP camera.
* 5V, 5A DC Power Source.
* 5V to 3.3V Step Down converter.
* 1 ESP8266-01s, can be used another ESP8266 module based with at least 2 GPIO pins.
* 5 Servo Motors: 
  * 2 Servo Motors MG996R
  * 3 Servo Motors SG-90
* 1 PCA9685 Servo Driver 16 channels.
* Wires
* 2 resistors 330 Ohm.
* 12 M3 Allen Bolts
* 1 Protoboard 

## ASSEMBLY

For the first 2 degrees of freedom, use 4 bolts to hold each MG996R Servo motor and 4 bolts for the PCA9685.
In the image the bigger hole is to hold the PCA9685 and the small for the Servo Motor MG996R.
![alt text](https://github.com/vcadillog/3D-printed-IoT-Robot-Arm-5DOF-NodeJS/blob/master/images/ARM-3.PNG)

The next 3 DOF can be assembled without screws only using pressure to hold the servo motors to the body.
The gripper consist of 2 pieces, one connected and holded to the servo motor and another guided by the movement and connected to the body not too tight.

## CONNECTIONS

The wire connection is made between the ESP8266 and the PCA9685 as the following image.
Default pins for Servo Motors and PCA9685 are [1,3,4,7,8], modify if you need in the arduino code.
![alt text](https://github.com/vcadillog/3D-printed-IoT-Robot-Arm-5DOF-NodeJS/blob/master/images/5DOF-ARM-SCHEMATIC.png)

## HOW TO USE

### Arduino code
* [1] Open the code  inside the code/arm-control/arm-control.ino . 
* [2] Set the values of you WiFi router and the Web Server URL and web socket of the Arduino code.
* [3] First uncomment the Update_Values Function inside the void loop of arduino to get the specific values of your servo motors.
* [4] Modify if required the pos0 and pos180 values to match the pulse width of your servo driver that map a movement of 0-180°.
* [5] Comment back the Update_Values after setting the values and upload the program to the ESP8266-01s.

### NodeJS code
* You have to need installed ffmpeg
* [1] Change directory in terminal to code/arm-frontend and install modules with:
  * Run npm init
  * Run npm install express
  * Run npm install node-matrix
  * Run npm install node-rtsp-stream  
* [2] Open the code inside code/arm-frontend/app.js
* [3] As the same done on the arduino code, modify your hostname with the IP of your computer and the PORT of your choice.
* [4] The IP camera use a RTSP protocol, it can't be showed in the template directly, since that modify with the RTSP direction of your IP camera, if you have an HTTP url, can be done directly modying the index.html template. The WS port for the IP camera has to be different than the PORT declared for your webserver.

### Template
* [1] Open the code inside code/arm-frontend/client/index.html
* [2] Change the web socket direction of your RTSP camera as the same in the JavaScript code.

## RUN THE CODE
* [1] After made all the modifications to the directions change the direction of the NodeJS app and run with:
node app.js
* [2] Turn on your Robot Arm.
* [3] Then open a browser and connect to the URL choseen.

![alt text](https://github.com/vcadillog/3D-printed-IoT-Robot-Arm-5DOF-NodeJS/blob/master/images/WEB-INTERFACE.PNG)

To move the Arm, use the keyboard Q,E to move the Z-axis, W,S to the Y-axis and A,D for the Z-axis; for the gripper O for open and P for close.
If the arm is moved outside the boundaries it will show invalid position since the Inverse Kinematics isn't posible to be calculated, and you have to move back to a position that is allowed.
The initial position is set as a extended arm.



## This code was based on:
* [1] Robot dynamic and Control. W. Spong
* [2] Multiplayer NodeJS game Tutorial 
https://scripterswar.com/tutorial/nodejs
* [3] Socket IO library for Arduino
https://github.com/timum-viw/socket.io-client

## To do:
* Change  the IP camera for a web camera.
* Create a circuit module for a easy connection.
* Modify the Arm Design of the base to allow connection of the ESP connection inside the arm, without external breadboard.





