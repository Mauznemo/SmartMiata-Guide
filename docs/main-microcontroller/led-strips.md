---
sidebar_position: 4
---

# LED strips

If you also want to add ambient lights to your interior you can simply control them with the Arduino.

## Wiring
TODO: Add wiring

## Arduino code

Now we have to add the code to control the LEDs.\
So add these definitions and pin modes and include the library FastLED (you may need to install it)

```cpp
#include <FastLED.h>

const int ledDataPin = 12;

const int ledCount = 56; //Change to number of LEDs on your strip
CRGB leds[ledCount];

void setup() {
  FastLED.addLeds<NEOPIXEL, ledDataPin>(leds, ledCount);
}
```

I for example have one long LED strip with 28 LEDs left and 28 on the right.

To set their color from the Unity app I have this code:
```cpp
void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');

  if (data.startsWith("ll_")) {
      String hexColor = data.substring(4);
      setLeftLedsColor(hexColor);
    } else if (data.startsWith("rl_")) {
      String hexColor = data.substring(4);
      setRightLedsColor(hexColor);
    }
  }
}

void setRightLedsColor(String hexColor) {
  // Convert hex string to CRGB
  CRGB color = hexToCRGB(hexColor);

  // Set the first half of the LEDs to the color
  for (int i = 0; i < ledCount / 2; i++) {
    leds[i] = color;
  }

  FastLED.show();
}

void setLeftLedsColor(String hexColor) {
  // Convert hex string to CRGB
  CRGB color = hexToCRGB(hexColor);

  // Set the second half of the LEDs to the color
  for (int i = ledCount / 2; i < ledCount; i++) {
    leds[i] = color;
  }

  FastLED.show();
}

CRGB hexToCRGB(String hexColor) {
  long number = strtol(&hexColor[0], NULL, 16);
  byte red = (number >> 16) & 0xFF;
  byte green = (number >> 8) & 0xFF;
  byte blue = number & 0xFF;
  return CRGB(red, green, blue);
}
```