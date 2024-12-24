---
sidebar_position: 2
---

# Software

## Arduino code
### Controlling the actuators
To control the actuators we just need to connect the 3 relays.
```cpp
const int doorsRelayPin1 = 5;
const int doorsRelayPin2 = 6;
const int trunkRelayPin1 = 7;

const int motorTimeMs = 50;
const int blockTimeMs = 1500;

void setup() {
  pinMode(doorsRelayPin1, OUTPUT);
  pinMode(doorsRelayPin2, OUTPUT);
  pinMode(trunkRelayPin1, OUTPUT);

  digitalWrite(doorsRelayPin1, LOW);
  digitalWrite(doorsRelayPin2, LOW);
  digitalWrite(trunkRelayPin1, LOW);
}

void unlockTrunk()
{
  digitalWrite(trunkRelayPin1, HIGH);

  delay(motorTimeMs);

  digitalWrite(trunkRelayPin1, LOW);

  delay(blockTimeMs);
}

void unlockDoors()
{
  digitalWrite(doorsRelayPin1, HIGH);
  digitalWrite(doorsRelayPin2, LOW);

  delay(motorTimeMs);

  digitalWrite(doorsRelayPin1, LOW);
  digitalWrite(doorsRelayPin2, LOW);

  doorsLocked = false;

  delay(blockTimeMs);
}

void lockDoors()
{
  digitalWrite(doorsRelayPin1, LOW);
  digitalWrite(doorsRelayPin2, HIGH);

  delay(motorTimeMs);

  digitalWrite(doorsRelayPin1, LOW);
  digitalWrite(doorsRelayPin2, LOW);

  doorsLocked = true;

  delay(blockTimeMs);
}
```

### Reading the remote box
Reading the remote box is also pretty simply since we can just handle it like a button.
```cpp
const int trunkUnlockPin = 2;
const int doorLockPin = 3;
const int doorUnlockPin = 4;

void setup()
{
  pinMode(trunkUnlockPin, INPUT);
  pinMode(doorUnlockPin, INPUT);
  pinMode(doorLockPin, INPUT);

  digitalWrite(trunkUnlockPin, HIGH);
  digitalWrite(doorUnlockPin, HIGH);
  digitalWrite(doorLockPin, HIGH);
}

void loop()
{
  checkTrunkUnlockPin();
  checkDoorUnlockPin();
  checkDoorLockPin();
}

bool lastTrunkUnlockVal;
bool lastDoorUnlockVal;
bool lastDoorLockVal;

void checkTrunkUnlockPin()
{
  bool trunkUnlockVal = digitalRead(trunkUnlockPin);

  if (lastTrunkUnlockVal != trunkUnlockVal)
  {
    lastTrunkUnlockVal = trunkUnlockVal;
    onTrunkUnlockChanged(trunkUnlockVal);
  }
}

void checkDoorUnlockPin()
{
  bool doorUnlockVal = digitalRead(doorUnlockPin);

  if (lastDoorUnlockVal != doorUnlockVal)
  {
    lastDoorUnlockVal = doorUnlockVal;
    onDoorUnlockChanged(doorUnlockVal);
  }
}

void checkDoorLockPin()
{
  bool doorLockVal = digitalRead(doorLockPin);

  if (lastDoorLockVal != doorLockVal)
  {
    lastDoorLockVal = doorLockVal;
    onDoorLockChanged(doorLockVal);
  }
}

void onTrunkUnlockChanged(bool val)
{
  if (!val)
  {
    unlockTrunk();
  }
}

void onDoorUnlockChanged(bool val)
{
  if (val)
  {
    unlockDoors();
  }
}

void onDoorLockChanged(bool val)
{
  if (val)
  {
    lockDoors();
  }
}
```

### Bluetooth

:::warning
The bluetooth code does not have authentication at the moment!
:::

Implementing the BLE module is also not too hard. You need the SoftwareSerial library to communicate withe the BLE module

```cpp
#include <SoftwareSerial.h>

#define RX_PIN 10
#define TX_PIN 11

SoftwareSerial bleSerial(RX_PIN, TX_PIN);

String receivedData = "";
bool autoLocking;

void setup()
{
  bleSerial.begin(9600);

  // Give some time for the HM-10 to initialize
  delay(1000);

  bleSerial.print("AT+NOTI1"); //Tell the BLE module to send us a message if a device connects or disconnects

  delay(500);
}

void loop()
{
  checkBle();
}

void checkBle()
{
  if (bleSerial.available())
  {
    // Read the data from the BLE module
    char incomingChar = bleSerial.read();
    if (isPrintable(incomingChar))
    {
      receivedData += incomingChar;
    }

    if (receivedData.indexOf("OK+CONN") != -1) //Device connected
    {
      receivedData = "";
    }
    else if (receivedData.indexOf("OK+LOST") != -1) //Device disconnected
    {
      if (autoLocking)
      {
        // Lock the car
        lockDoors();
      }
      autoLocking = false;
      receivedData = "";
    }

    // If the data ends with a newline character, process it
    if (incomingChar == '\n')
    {
      receivedData.trim();
      if (receivedData == "ds") //Get door state
      {
        bleSerial.println(doorsLocked ? "ld" : "ud");
      }
      else if (receivedData == "ld") //lock doors
      {
        bleSerial.println("ld");
        lockDoors();
      }
      else if (receivedData == "ud")  //unlock doors
      {
        bleSerial.println("ud");
        unlockDoors();
      }
      else if (receivedData == "ut") //unlock trunk
      {
        unlockTrunk();
      }
      else if (receivedData == "al") //enable auto locking (proximity key)
      {
        autoLocking = true;
        if (doorsLocked)
        {
          unlockDoors();
        }
      }
      else if (receivedData == "ald") //disable auto locking
      {
        autoLocking = false;
      }

      receivedData = "";
    }
  }
}
```

[**Code off Android App to lock, unlock and use proximity key**](https://github.com/Mauznemo/SmartifyOS-App)

### Full code

You can get the full code from GitHub: **[SmartMiata miata-central-lock-controller.ino](https://github.com/Mauznemo/SmartMiata/blob/main/Arduino/miata-central-lock-controller/miata-central-lock-controller.ino)**
