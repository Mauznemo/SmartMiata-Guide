---
sidebar_position: 1
---

# GPS data

To have the speed on the screen and to set the date and time on every boot we need a GPS module.

:::note
SmartifyOS uses Android Auto (CarPlay will be added later) for navigation, so the GPS is only for time and speed.
:::

To communicate with the GPS module we need to use these packages.

```cpp
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>

//For sending date and time as json
#include <ArduinoJson.h>
```

Then we need some definition.

```cpp
static const int RXPin = 4, TXPin = 3;
static const uint32_t GPSBaud = 9600;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

float speedKmH = -1;

//For sending the date and time every 7 sec
unsigned long lastDateSentTime = 0;
const unsigned long sendDateInterval = 7000;

unsigned long previousMillis = 0;
```

In `setup()` we need to begin the serial communications.

```cpp
void setup() {
  Serial.begin(9600);
  ss.begin(GPSBaud);
}
```

And this is the code needed in `loop()`.

```cpp
void loop() {
  while (ss.available() > 0)
    gps.encode(ss.read());

  if (gps.speed.isValid()) {
    speedKmH = gps.speed.kmph();
  }
  
  unsigned long currentTime = millis();

  if (currentTime - lastDateSentTime >= sendDateInterval) {
    sendTimeAndDate();
    lastDateSentTime = currentTime;
    return;
  }

  Serial.println(speedKmH);
}

void sendTimeAndDate() {
  if (!gps.time.isValid() || !gps.date.isValid())
    return;

  StaticJsonDocument<100> jsonDoc;

  // Add time to JSON
  JsonObject timeObject = jsonDoc.createNestedObject("time");
  timeObject["h"] = gps.time.hour();
  timeObject["m"] = gps.time.minute();
  timeObject["s"] = gps.time.second();

  // Add date to JSON
  JsonObject dateObject = jsonDoc.createNestedObject("date");
  dateObject["d"] = gps.date.day();
  dateObject["m"] = gps.date.month();
  dateObject["y"] = gps.date.year();

  String jsonString;
  serializeJson(jsonDoc, jsonString);

  Serial.println(jsonString);
}
```