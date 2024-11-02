---
sidebar_position: 3
---

# Control popups from Unity

:::caution

This code depends on [SmartifyOS](https://smartify-os.com/)!

:::

## Creating the script

Now we can create a new Serial Communication Script to control the Arduino and popups from unity. I called mine `LightController.cs`

For more detail have a look at: **[SmartifyOS Docs | Serial Communication](https://docs.smartify-os.com/docs/serial-communication/)**


## Control popups over serial
Now we can create all the function to control the popups.

```cs title="LightController.cs"
 public void Toggle()
 {
     Send("tg");
 }

 public void WinkLeft()
 {
     Send("wl");
 }

 public void WinkRight()
 {
     Send("wr");
 }

 public void ToggleWave()
 {
     Send("tw");
 }

 public void Down()
 {
     Send("rs");
 }

 public void AllowModifyingLightsWhileOn(bool allow)
 {
     if (allow)
     {
         Send("am");
     }
     else
     {
         Send("dm");
     }
 }
```
To optionally test the code we can use a button to call the functions, so create a button. To read that button we can just do:

```cs
 [SerializeField] private Button toggleButton;

 private void Awake()
 {
     toggleButton.onClick.AddListener(() =>
     {
         Toggle();
     });
 }
```

## Receive state of popups
To update the button UI or 3D render of the car depending on if the lights are closed or opened we need to read the serial data from the Arduino.

```cs title="LightController.cs"
public override void Received(string message)
{
    switch (message)
    {
        case "ru":
            Debug.Log("Right light opend");
            break;
        case "rd":
            Debug.Log("Right light closed");
            break;
        case "lu":
            Debug.Log("Left light opend");
            break;
        case "ld":
            Debug.Log("Left light closed");
            break;

        case "ws": //waving started
            waving = true;
            Debug.Log("Started waving");
            break;
        case "we": // waving ended
            waving = false;
            Debug.Log("Stopped waving");
            break;

        case "el": //error light (when trying to change light motor state while light is on)
            Debug.Log("Light Warning");
            break;
    }
}
```

TODO: Link BaseAnimatedObject docs

## Getting popups state on startup
Every time the Unity application starts the light state will be lost, so we need to get it every start.

To do this we can simply do this:
```cs title="LightController.cs"
    private void Start()
    {
        //Other code...

        if (IsConnected())
            StartCoroutine(RequestData());

    }

    private IEnumerator RequestData()
    {
        yield return new WaitForSeconds(1f);
        Send("ss");
    }
```
I added the delay because it sometimes didn't work without it.

## Full code
You can have a look at the full light controller code here: **[SmartifyOS LightController.cs](https://github.com/Mauznemo/SmartifyOS/blob/main/Assets/Scripts/Arduinos/LightController.cs)**.