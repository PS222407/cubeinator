int spd = 1500; //MICROSECONDS lager = sneller maar ook minder torque

// Define stepper motor connections and steps per revolution:
#define stepsPerRevolution 200

#define dirPinTOP 2
#define stepPinTOP 3

#define dirPinFRONT 4
#define stepPinFRONT 5

#define dirPinBOTTOM 6
#define stepPinBOTTOM 7

#define dirPinBACK 8
#define stepPinBACK 9

#define dirPinRIGHT 10
#define stepPinRIGHT 11

#define dirPinLEFT 12
#define stepPinLEFT 13

void setup() {
  pinMode(stepPinTOP, OUTPUT);    //
  pinMode(dirPinTOP, OUTPUT);     //
  digitalWrite(dirPinTOP, HIGH);  //

  pinMode(stepPinFRONT, OUTPUT);
  pinMode(dirPinFRONT, OUTPUT);
  digitalWrite(dirPinFRONT, LOW);

  pinMode(stepPinBOTTOM, OUTPUT);
  pinMode(dirPinBOTTOM, OUTPUT);
  digitalWrite(dirPinBOTTOM, LOW);



  pinMode(stepPinBACK, OUTPUT);
  pinMode(dirPinBACK, OUTPUT);
  digitalWrite(dirPinBACK, LOW);
  
  pinMode(stepPinRIGHT, OUTPUT);
  pinMode(dirPinRIGHT, OUTPUT);
  digitalWrite(dirPinRIGHT, LOW);
  
  pinMode(stepPinLEFT, OUTPUT);
  pinMode(dirPinLEFT, OUTPUT);
  digitalWrite(dirPinLEFT, LOW);
}
int count = 0;
void loop() {
//  
//  digitalWrite(dirPinTOP, LOW);
//  if(count % 2 == 0){
//    digitalWrite(dirPinTOP, HIGH);
//  }
  
  //Spin the stepper motor 5 revolutions fast:

  motorTOP();
  motorFRONT();
  motorBOTTOM();
  
  motorBACK();
  motorRIGHT();
  motorLEFT();
//  delay(0);

  count++;
  delay(3000);
}


void motorTOP(){
    for (int i = 0; i < 150; i++) {
    digitalWrite(stepPinTOP, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinTOP, LOW);
    delayMicroseconds(spd);
  }
}
void motorFRONT(){
    for (int i = 0; i < 50; i++) {
    digitalWrite(stepPinFRONT, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinFRONT, LOW);
    delayMicroseconds(spd);
  }
}
void motorBOTTOM(){
    for (int i = 0; i < 200; i++) {
    digitalWrite(stepPinBOTTOM, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinBOTTOM, LOW);
    delayMicroseconds(spd);
  }
}
void motorBACK(){
    for (int i = 0; i < 200; i++) {
    digitalWrite(stepPinBACK, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinBACK, LOW);
    delayMicroseconds(spd);
  }
}
void motorRIGHT(){
    for (int i = 0; i < 200; i++) {
    digitalWrite(stepPinRIGHT, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinRIGHT, LOW);
    delayMicroseconds(spd);
  }
}
void motorLEFT(){
    for (int i = 0; i < 200; i++) {
    digitalWrite(stepPinLEFT, HIGH);
    delayMicroseconds(spd);
    digitalWrite(stepPinLEFT, LOW);
    delayMicroseconds(spd);
  }
}
