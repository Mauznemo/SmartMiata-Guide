---
sidebar_position: 3
---

# Reading steering angle

If you want to know your Miata's steering angle to show it in the reverse camera or 3D model follow these steps.

## Hardware
To measure the rotations in a way where the position doesn't get lost when for example rotated without power I used this [10-turn wire-wound potentiometer (10K)](https://www.ebay.de/itm/355243316155?itmmeta=01J0G8JQADE5M31KGNKHVGFC7Z&hash=item52b626d3bb:g:HasAAOSwvd1lZvwa&var=624459938435)

## 3D Print
To mount it and make sure the rotation count of my steering column (3) gets converted to 9 rotations of the potentiometer I made this:

![40%](/img/miata-steering-angle-cad.png)

You need to cut off a bit of the plastic casing around the steering column.

![40%](/img/miata-steering-angle-photo.png)

To mount the two halves of the big gear I used some hot glue.

### File downloads

CAD files - [Download](https://www.thingiverse.com/thing:6674907)

## Arduino code

On the Arduino we need some code to convert the rotations of the potentiometer to the correct angle of the steering wheel.

```cpp
float stWheelAngle;  //-540° to 540° (1080° because steering wheel cam turn 3 times total)

void loop() {
  int potValue = analogRead(steerPin); //10 rotations: 0 to 1023, 1 rotation: 102.3
  stWheelAngle = fmap(potValue, 51, 972, -540.0, 540.0); // One rotation play so from 51.15 (= 102.3 / 2) to 972 (= 1023 - 102.3 / 2)

  Serial.println(stWheelAngle);
}

float fmap(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
```