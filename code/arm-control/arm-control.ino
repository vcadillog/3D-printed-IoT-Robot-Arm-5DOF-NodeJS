#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

#define USE_SERIAL Serial
#define SDA_PIN 0
#define SCL_PIN 2
//I2C PINS ESP8266 GPIO5 (SDA), GPIO0 (SCL)
SocketIoClient webSocket;
TwoWire I2CPCA = TwoWire();
Adafruit_PWMServoDriver servos = Adafruit_PWMServoDriver(0x40,I2CPCA);
unsigned int pos0 = 140; //pulse width for 0°
unsigned int pos180 = 650; //pulse width for 180°

float __attribute__((aligned(4))) theta[6];

const char* ssid = "Your-WiFI-SSID";
const char* password = "Your-Password";
String url =  "http://Your local web server:Port"; //example: "http://192.168.1.23:8080/"; has to match to the NodeJS app URL.
const char* web_socket_ip = "Your local web server"; // To match the url: "192.168.1.23"
const int PORT = 8080; // The port of your web server to match url variable.

void setup()
{

  USE_SERIAL.begin(115200);
  USE_SERIAL.setDebugOutput(true);
  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }
  // Conectar WiFi
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
    delay(500);

  webSocket.on("newAngles", event);  
  webSocket.begin(web_socket_ip,PORT); //"192.168.1.23",8080

  I2CPCA.begin(SDA_PIN,SCL_PIN, 15000);
  servos.begin();
  
  servos.setPWMFreq(60);
  servos.setPWM(1,0,pos0);
  servos.setPWM(3,0,pos0);
  servos.setPWM(4,0,pos0);
  servos.setPWM(7,0,pos0);
  servos.setPWM(8,0,pos0+100);
  delay(500);  
}

void loop()
{
 //Update_Values(); //USE TO GET THE VALUES FOR YOUR SERVO MOTORS pos0 and pos180
  webSocket.loop();
  setServo(1, theta[1]);
  setServo(3, theta[2]); 
  setServo(4, theta[3]);
  setServo(7, theta[4]);  
  setServo(8, theta[5]);  
}

void Update_Values(){
    if (USE_SERIAL.available()>0){
    String stringbuffer;
    stringbuffer = USE_SERIAL.readString();
    pos0 = stringbuffer.substring(0,3).toInt();
    pos180 = stringbuffer.substring(4,7).toInt();          
    USE_SERIAL.print("Angle  0°: ");
    USE_SERIAL.println(pos0);
    USE_SERIAL.print("Angle 180°: ");
    USE_SERIAL.println(pos180);
  }   
  for (int duty = pos0; duty < pos180; duty=duty+10) {
    for(int n=0;n<16;n++)
    {
      servos.setPWM(n,0,duty);
    }   
  }
  delay(1000);
  for (int duty = pos180; duty > pos0; duty=duty-10) {
    for(int n=0;n<16;n++)
    {
      servos.setPWM(n,0,duty);
    }   
  }
  delay(1000);  
}
void event(const char * payload, size_t length) {
  USE_SERIAL.printf("got message: %s\n", payload);
  int __attribute__((aligned(4))) comma[6];
  int __attribute__((aligned(4))) point[6];
  int  counter = 0;
  int comma_counter = 0;
  int point_counter = 0;


  while (comma_counter < 5) {
    if (payload[counter] == ':') {
      point[point_counter + 1] = counter;
      point_counter++;
    }
    else if (payload[counter] == ',') {
      comma[comma_counter + 1] = counter;
      comma_counter++;
    }
    counter++;
  }
  for (int j = 1; j <= 5; j++) {
    int k = 0;
    char buf[10] = " ";
    for (int i = point[j] + 1; i <= comma[j] - 1; i++) {
      buf[k] = payload[i];
      k++;
    }
    if (buf[0] == 'n') {
      USE_SERIAL.println("Invalid");
    }
    else {
      theta[j] = atof(buf);
    }
  }
}

void setServo(uint8_t n_servo, float angle) {
  int duty;
  angle = angle * 180.0/PI;
  duty = map(angle, 0, 180, pos0, pos180);
  servos.setPWM(n_servo, 0, duty);
}
