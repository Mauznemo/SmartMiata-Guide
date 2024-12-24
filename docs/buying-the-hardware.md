---
sidebar_position: 3
---

# Buying the Hardware
Now that we can control the popups with Unity we need some hardware like a computer and screen that will run all the software in the Miata.

## Buying the computer
If you're also using [SmartifyOS](https://smartify-os.com/) for making the system you can't use a Raspberry Pi (at the moment) because it has an arm based system and Unity can only export to x86 and a Raspberry Pi probably doesn't have enough performance to run the 3D rendering at 60 FPS.

After a while of searching I decided to go with the [youyeetoo X1](https://amzn.to/41JzvW9) because it seemed good for this project (It has pretty slow boot times, if you know of a mini computer of that size and price range that is better let me know!).

## Buying the Screen

I decided to use [this](https://www.dwin-global.com/10-1-inch-1024xrgbx600-hdmi-display-model-hdw101_001lz09-product/) screen because it is 10 inch and matches all of my search criteria.

## Other things we need

1. Buck Converters I used one [XL4015 DC-DC](https://amzn.to/41SOpJF) to power the computer.
2. Some smaller Buck Converters there I used one [LM 2596S DC-DC](https://amzn.to/3Pc7oHv) to power the popup controller Arduino and the RGB controller. You can get a 10 pack of them because it is really easy to read the high or low state of the 12V car with an Arduino (because it needs 5V) and I will use them later in the project.
3. 3 Arduinos, I used two [Unos](https://amzn.to/3VWvdHb), one [Mega](https://amzn.to/4iNgwzX) and one [Nano](https://amzn.to/3VTjI3p) for the central locking, but this will depend on your needs. I have one Uno to control the popups one for the GPS and RPM reading, and the Mega for everything else.
4. A GPS module for the speedo and position, I used the [NEO-6M](https://amzn.to/4iNekbH).
5. TODO: Link better gps antenna (if it works)
6. For controlling the popups you need some relays, I used [these](https://amzn.to/41KFb2b) and if you want used my 3D models without changing anything use some with the same dimensions and screw holes.
7. If you want any connectivity like Bluetooth you need a Bluetooth USB Dongle or a Bluetooth card if your mini computer has a slot.
8. If you don't have any you can also get some [M3 screws](https://amzn.to/4gvn58H) to screw everything together later.
9. Also get 2 [USB Hubs with 4 ports](https://amzn.to/4gAJbXx) each.
10. If you want to add a USB reverse camera you also need an around [5 meter USB cable](https://amzn.to/40a31Do).
11. A [fan](https://amzn.to/4gwKw1yf) to cool the mini computer
12. And some [cable ties](https://amzn.to/49V4dNS), [shrink tubing](https://amzn.to/4073rdz) and [wire](https://amzn.to/3ZOSnQR) could also be useful if you don't have any.
13. (I also got new [speakers](https://amzn.to/3PadSXl) and an [AMP](https://amzn.to/4fueS3j))