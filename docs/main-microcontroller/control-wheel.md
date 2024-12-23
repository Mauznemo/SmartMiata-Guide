---
sidebar_position: 3
---

# Adding a control wheel

If your Miata also doesn't have window switches in the center console you can replace the cover plate with this 3D printed one.

## 3D print
You need a KY-040 rotary encoder to use my design.

![](/img/miata-console-cover-rotary.png)

### File downloads

CAD files - [Download](https://www.thingiverse.com/thing:6826846)

## Arduino code

Now we have to add the code to read the rotary encoder to the same script.\
So add these definitions and pin modes and include the library Encoder (you may need to install it):

```cpp
#include <Encoder.h>

Encoder rotaryEncoder(14, 15);
long oldRotaryPosition = -999;
const int rotaryButtonPin = 16;

bool lastRotaryButtonVal;

void setup() {
  pinMode(rotaryButtonPin, INPUT);

  digitalWrite(rotaryButtonPin, HIGH);
}
```

And to read the button and encoder and send all changes to the unity application we need to add this to the code:

```cpp
void loop() {
  checkRotary();
  checkRotaryButton();
}

void checkRotary() {
  long newPosition = rotaryEncoder.read();

  if (newPosition > oldRotaryPosition && (newPosition - oldRotaryPosition) >= 2) {
    Serial.println("cwd");
    oldRotaryPosition = newPosition;
  } else if (newPosition < oldRotaryPosition && (oldRotaryPosition - newPosition) >= 2) {
    Serial.println("cwu");
    oldRotaryPosition = newPosition;
  }
}

void checkRotaryButton() {
  bool buttonVal = digitalRead(rotaryButtonPin);

  if (lastRotaryButtonVal != buttonVal) {
    lastRotaryButtonVal = buttonVal;
    onRotaryButtonChanged(buttonVal);
  }
}

void onRotaryButtonChanged(bool val) {
  if (val) {
    Serial.println("cwbu");
  } else {
    Serial.println("cwbd");
  }
}
```