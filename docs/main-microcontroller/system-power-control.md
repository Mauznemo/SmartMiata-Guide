---
sidebar_position: 1
---

# System power control

At the beginning we build a circuit for the system power, so that the computer can safely shutdown.

To do this we first need to create a new Arduino script and define some variables.

```cpp
const int powerCheckPin = 3;
const int powerRelayPin = 4;

bool lastSystemPower = true;
```

In `setup()` we need to set the pin modes.

```cpp
void setup() {
  pinMode(powerCheckPin, INPUT);
  pinMode(powerRelayPin, OUTPUT);

  digitalWrite(powerRelayPin, HIGH);
  Serial.begin(9600);
}
```

In `update()` we can read the power state.

```cpp
void loop() {
   checkPower();
}

void checkPower() {
  bool powerVal = digitalRead(powerCheckPin);

  if (lastSystemPower != powerVal) {
    lastSystemPower = powerVal;
    onPowerChanged(powerVal);
  }
}

void onPowerChanged(bool val) {
  if (val) {
    Serial.println("p");
  } else {
    Serial.println("po");
  }
}
```

This will send an update to the unity application, and we will implement the unity side later.\
The unity application will also handle the shutting down, so we need to add some more code to `loop()`.

```cpp
void loop() {
  checkPower();
  
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');

    if (data == "sd") {
      sendData();
    } 
    else if (data == "off") {
      powerOff();
    } 
  }
}

void sendData(){
  if(!digitalRead(powerCheckPin)){
    Serial.println("off");
  }
}

void powerOff(){
  delay(30000);

  digitalWrite(powerRelayPin, LOW);
}
```
