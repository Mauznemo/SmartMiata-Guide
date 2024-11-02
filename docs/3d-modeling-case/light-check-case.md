---
sidebar_position: 2
---

# Light check case
TODO: Add DRL check

To automatically open the popups we need some way to know if the light is turned on. For this I just used the interior light pin that turns on when the light is activated. Since this pin also outputs 12V I just used another LM 2596S to convert it to 5V, so the Arduino can read it. (**You can also just build a voltage divider**)

![70%](/img/light-check-case.png)

This case is designed to fit one LM 2596S to convert the interior light pin 12V down to 5V.

:::info
You can print two of them because we later need another one to check if the car is in reverse.
:::

## File downloads

Fusion 360 file (.f3d) - [Download](/files/light-check-case.f3d)\
Step file (.step) - [Download](/files/light-check-case.step)