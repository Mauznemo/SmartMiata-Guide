---
sidebar_position: 5
---

# Reverse check

If you also want to add a reverse camera it would be good to know if the car is in reverse so that the camera automatically opens.

## Wiring
To do this you can put the cars key in the on position and use a multimeter to find which pin of the reverse light is high while the car is in reverse.\
Then you can use another LM 2596S to convert the 12V down to 5V so that the Arduino can read it (a voltage divider should work too).

![50%](/img/PXL_reverse-check.jpg)

## Arduino code

First add some more variables to our script.

```cpp
const int reverseCheckPin = 5;

bool lastReverseVal;

void setup() {
  pinMode(reverseCheckPin, INPUT);

  digitalWrite(reverseCheckPin, HIGH);
}
```

And in loop we need to add:

```cpp

const int reverseCheckPin = 5;

void loop() {
  checkReverse();
}

void checkReverse() {
  bool reverseVal = digitalRead(reverseCheckPin);

  if (lastReverseVal != reverseVal) {
    lastReverseVal = reverseVal;
    onReverseChanged(reverseVal);
  }
}

void onReverseChanged(bool val) {
  if (val) {
    Serial.println("re");
  } else {
    Serial.println("rd");
  }
}
```


