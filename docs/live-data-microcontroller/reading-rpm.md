---
sidebar_position: 2
---

# Reading the RPM

## Wiring
My Miata has no OBD port, so I need to use the diagnostics box to read the RPM.

![50%](/img/miata-diagnostics-box.jpg)

To read The RPM we can use the `IG-` pin.

![50%](/img/RPM.png)

If we now want to use an Arduino to read the signal we need a voltage divider to get the around 13V down to around 4V.\
You can use one of those [online calculators](https://ohmslawcalculator.com/voltage-divider-calculator) to find the correct resistors.

![40%](/img/voltage-divider.png)

## Arduino Code

First we need to define some variables.

```cpp
const int rpmPin = 2;

float rpm = 0;

volatile unsigned long lastPulseTime = 0;
volatile unsigned long pulseInterval = 0;
```

Then we need to set the pin mode and use `attachInterrupt()` to count the pulses.

```cpp
void setup() {
  pinMode(rpmPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(rpmPin), onPulse, RISING);
}

void countPulse() {
  pulseCount++;
}
```

And in `loop()` we check if there are no more pulses to reset it back to zero.

```cpp
void loop() {
  
  checkForPulses();

  Serial.println(rpm);
}
```

```cpp
void checkForPulses() {
  unsigned long currentTime = micros();  // Current time in microseconds
  unsigned long pulseInterval = currentTime - lastPulseTime;

  if(pulseInterval > 1000000) { //No pulse for over 1 sec reset
    rpm = 0;
  }
}

void onPulse() {
  unsigned long currentTime = micros();  // Current time in microseconds
  pulseInterval = currentTime - lastPulseTime;  // Time between this and last pulse
  lastPulseTime = currentTime;

  // Calculate RPM
  if (pulseInterval > 0) { // Prevent division by zero
    rpm = (1000000.0 / pulseInterval) * 60.0 / 2.0;
  }
}
```

It is calculated like this because there are two pulses per one rotation.