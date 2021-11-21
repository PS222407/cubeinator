//const int DATA_SIZE = 4;
//byte data[DATA_SIZE];   // an array to store the received data

int maxSolveLenght = 315;

String dataString;
int count = 0;
//String acknowledge = String("Acknowledge");

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("setup"); //setup
  pinMode(13, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  while(Serial.available() > 0)
  {
      String readstring = Serial.readString();
      
      Serial.println(readstring + " ontvangen");
//      int i = Serial.readBytes(data,DATA_SIZE);

      Serial.println(count);
      count++;

      dataString += readstring;
      if(readstring[62] == '1'){
        Serial.println(dataString);
        solve();
      }
  }
  delay(500);
}

void solve(){
//  Serial.println(dataString);
  for(int i = 0; i < maxSolveLenght; i++){
    {
      if(dataString[i] == 'a'){
        digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
      }
      else if (dataString[i] == 'b'){
        digitalWrite(13, LOW);   // turn the LED on (HIGH is the voltage level)
      }
      else if (dataString[i] == 'c'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'd'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'e'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'f'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'g'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'h'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'i'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'j'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'k'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'l'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'm'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'n'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'o'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'p'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'q'){
        digitalWrite(13, LOW);
      }
      else if (dataString[i] == 'r'){
        digitalWrite(13, LOW);
      }
      else{
//      Serial.println("DONE");
        digitalWrite(13, LOW);
      }
      Serial.println(dataString[i]);
      delay(100);
    }
  }
}


//the code receives 5 arrays by using callbacks, the array is converted to a string (dataString) that will be used to loop through the moves that the motor needs to make.

//MOVE TO BYTES INTERFACE
// U  = a
// U' = b
// F  = c
// F' = d
// D  = e
// D' = f
// B  = g
// B' = h
// R  = i
// R' = j
// L  = k
// L' = l
// U2 = m
// F2 = n
// D2 = o
// B2 = p
// R2 = q
// L2 = r
