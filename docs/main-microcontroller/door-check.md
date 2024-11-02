---
sidebar_position: 3
---

# Door state check

If you also want to read if the doors are open or closed then this is how to do it.

## Wiring
The Miata already has sensors in the door but the only thing they seem to do is control the interior light, and we can just use a relay to do that later.
This means we can just cut off the original wires from the door senors, solder our own wire on, route it to the Arduino Mega and connect it to the pins which are defined in the code below.

![40%](/img/PXL_door-sensor.jpg)

## Arduino code

First add some more variables to our script.

```cpp
const int leftDoorPin = 8;
const int rightDoorPin = 9;

bool lastLeftDoorVal;
bool lastRightDoorVal;

void setup() {
  pinMode(leftDoorPin, INPUT);
  pinMode(rightDoorPin, INPUT);

  digitalWrite(leftDoorPin, HIGH);
  digitalWrite(rightDoorPin, HIGH);
}
```

And in loop we need to add:

```cpp
void loop() {
  checkLeftDoor();
  checkRightDoor();
}

void checkLeftDoor() {
  bool leftDoorVal = digitalRead(leftDoorPin);

  if (lastLeftDoorVal != leftDoorVal) {
    lastLeftDoorVal = leftDoorVal;
    onLeftDoorChanged(leftDoorVal);
  }
}

void checkRightDoor() {
  bool rightDoorVal = digitalRead(rightDoorPin);

  if (lastRightDoorVal != rightDoorVal) {
    lastRightDoorVal = rightDoorVal;
    onRightDoorChanged(rightDoorVal);
  }
}

void onLeftDoorChanged(bool val) {
  if (val) {
    Serial.println("ldc");
  } else {
    Serial.println("ldo");
  }
}

void onRightDoorChanged(bool val) {
  if (val) {
    Serial.println("rdc");
  } else {
    Serial.println("rdo");
  }
}
```
