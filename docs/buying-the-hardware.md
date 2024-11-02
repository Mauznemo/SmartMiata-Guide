---
sidebar_position: 4
---

# Buying the Hardware
Now that we can control the popups with Unity we need some hardware like a computer and screen that will run all the software in the Miata.

## Buying the computer
If you're also using [SmartifyOS](https://smartify-os.com/) for making the system you can't use a Raspberry Pi (at the moment) because it has an arm based system and Unity can only export to x86 and a Raspberry Pi probably doesn't have enough performance to run the 3D rendering at 60 FPS.

After a while of searching I decided to go with the [youyeetoo X1](https://www.amazon.de/dp/B0CD2D38XD?ref=ppx_yo2ov_dt_b_product_details&th=1) because it seemed good for this project.

## Buying the Screen

I decided to use [this](https://www.dwin-global.com/10-1-inch-1024xrgbx600-hdmi-display-model-hdw101_001lz09-product/) screen because it is 10 inch and matches all of my search criteria.

## Other things we need

1. Buck Converters I used one [XL4015 DC-DC](https://www.amazon.de/dp/B07XRF9NWP?psc=1&ref=ppx_yo2ov_dt_b_product_details) to power the computer.
2. Some smaller Buck Converters there I used one [LM 2596S DC-DC](https://www.amazon.de/gp/product/B0BHJ6BV34/ref=ppx_yo_dt_b_asin_title_o05_s00?ie=UTF8&psc=1) to power the popup controller Arduino and the RGB controller. You can get a 10 pack of them because it is really easy to read the high or low state of the 12V car with an Arduino (because it needs 5V) and I will use them later in the project.
3. 3 Arduinos, I used two Unos and one Mega, but this will depend on your needs. I have one Uno to control the popups one for the GPS and RPM reading, and the Mega for everything else.
4. A GPS module for the speedo and position, I used the [NEO6](https://www.amazon.de/ICQUANZX-GY-NEO6MV2-GPS-Flugsteuerungsmodul-superstarker-Keramikantenne/dp/B088LR3488).
5. TODO: Link better gps antenna (if it works)
6. For controlling the popups you need some relays, I used [these](https://www.amazon.de/gp/product/B09GY34ZFQ/ref=ppx_yo_dt_b_asin_title_o09_s00?ie=UTF8&psc=1) and if you want used my 3D models without changing anything use some with the same dimensions and screw holes.
7. If you want any connectivity like Bluetooth you need a [Bluetooth Dongle](https://www.amazon.de/gp/product/B09TT7SXHY/ref=ewc_pr_img_2?smid=A2CG3ERB0N4L13&psc=1).
8. If you don't have any you can also get some [M3 screws](https://www.amazon.de/dp/B09DSM9KDC?psc=1&ref=ppx_yo2ov_dt_b_product_details) to screw everything together later.
9. Also get 2 [USB Hubs with 4 ports](https://www.amazon.de/s?k=usb+hub+4+ports&crid=UJWUGGVV1PRJ&sprefix=usb+hub+4%2Caps%2C108&ref=nb_sb_ss_ts-doa-p_1_9) each.
10. If you want to add a USB reverse camera you also need an around [5 meter USB cable](https://www.amazon.de/dp/B00BBPVOYO?psc=1&ref=ppx_yo2ov_dt_b_product_details).
11. And some cable ties, shrink tubing and wire could also be useful if you don't have any.