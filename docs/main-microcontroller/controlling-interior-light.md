---
sidebar_position: 6
---

# Controlling interior light

If you also want to be able to control the interior light with the touch screen you can do it really easily.

## Wiring
If the interior lights switch is in the middle, where it activates when the door is open, we can control it by shorting the old door sensor wire to GND, since we removed it from the sensor.

:::info
I think when you do it this way it might start beeping for some Miatas (not for me) then just remove the beeper.
:::

I just put a relay to short the old door sensor wire to GND.

## Arduino code

This is the code we need to control it.

```cpp
const int lightRelayPin = 10;

void setup() {
  pinMode(lightRelayPin, OUTPUT);

  digitalWrite(lightRelayPin, LOW);
}

void loop() {

  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    if (data == "le") {
      setLight(true);
    } 
    else if (data == "ld") {
      setLight(false);
    }
  }
}

void setLight(bool active){
  digitalWrite(lightRelayPin, active);
}
```