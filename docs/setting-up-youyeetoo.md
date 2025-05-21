---
sidebar_position: 4
---

# Setting up the youyeetoo
If you have a youyeetoo X1 follow these steps to get the fastest boot.

I got it down to **30sec** from the time the key is turned until SmartifyOS opens up. **Without** the NVMe M.2 and modified bios setting (the reason the CMOS battery is needed) it took around **1min and 30sec**.

## BIOS Settings
First go to `Chipset` then `PCH-IO Configuration` and set `Wake on Power (Automatic On)` to `S0 State`.

Next go to `Advanced` and `USB Configuration` and set these values:
![60%](/img/bios-usb.jpg)

## Installing SmartifyOS
To Install SmartifyOS follow [these](https://docs.smartify-os.com/docs/Export/installer) steps from the SmartifyOS docs.


