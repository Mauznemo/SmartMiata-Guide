---
sidebar_position: 4
---

# Communicating with main microcontroller

First we need to inherit from `BaseArduinoCommunication` and create an instance.

```cs
public class MicroController : BaseArduinoCommunication
{
    public static MicroController Instance { get; private set; }

    private void Awake()
    {
        Instance = this;
    }
}
```

## Variables

First we have some events for other scripts to subscribe to.

```cs
public static event Action OnReverse;
public static event Action OnForward;
public static event Action<bool> OnActionButton1;
public static event Action<bool> OnActionButton2;

public static event Action<bool> OnLeftDoorOpened;
public static event Action<bool> OnRightDoorOpened;

public static bool leftDoorOpen;
public static bool rightDoorOpen;

public static bool systemPower = true;

public static bool cancleShutdown;

[SerializeField] private CanvasGroup canvasGroup;
[SerializeField] private GameObject nowPowerIcon;
[SerializeField] private PowerOffWarningWindow powerOffWarningWindow;
```

## Start()

```cs
private void Start()
{
    if (string.IsNullOrEmpty(portName))
        portName = SaveManager.Load().microController.arduinoPort;
    Init();

    StartCoroutine(RequestData());    
}

private IEnumerator RequestData()
{
    yield return new WaitForSeconds(0.2f);
    ActivateScreen();
    yield return new WaitForSeconds(0.9f);
    if (!IsConnected())
    {
        yield break;
    }
    Send("sd");
}
```
After initializing we request the data so that everything is displayed correctly.

## Update()

In `Update()` we just read the messages.

```cs
private void Update()
{
    ReadMessage();
}
```

## Handling received messages

Most of the things in here just call a specific event when the Arduino sends the correct string.

```cs
public override void Received(string message)
{
    switch (message)
    {
        case "po":
            systemPower = false;
            nowPowerIcon.SetActive(true);

            //check if there was rpm before, if so shutdown instantly
            if(GpsController.highestRpm > 1)
            {
                ShutdownSystem();
            }
            else
            {
                StartCoroutine(WaitForPowerRestore());
            }      
            break;
        case "p":
            systemPower = true;
            nowPowerIcon.SetActive(false);

            break;
        case "re": //in reverse
            OnReverse?.Invoke();
            break;
        case "rd": //not in reverse
            OnForward?.Invoke();
            break;
        case "a1u":
            OnActionButton1?.Invoke(false); //Down is true
            break;
        case "a1d":
            OnActionButton1?.Invoke(true);
            break;
        case "a2u":
            OnActionButton2?.Invoke(false);
            break;
        case "a2d":
            OnActionButton2?.Invoke(true);
            break;
        case "ldo":
            OnLeftDoorOpened?.Invoke(true);
            leftDoorOpen = true;
            break;
        case "ldc":
            OnLeftDoorOpened?.Invoke(false);
            leftDoorOpen = false;
            break;
        case "rdo":
            OnRightDoorOpened?.Invoke(true);
            rightDoorOpen = true;
            break;
        case "rdc":
            OnRightDoorOpened?.Invoke(false);
            rightDoorOpen = false;
            break;
    }
}
```

## Power off manager

This code is needed so that the system doesn't power off when starting the engine, because the ignition switched power gets cut off for a short time.

So if you just start the system, not the engine and remove the key it will ask you after 3 sec if you want to power off the system. If you don't click on cancel it will power off after a short time.

But if the engine was on it will power of as soon as you remove the key.

```cs
public void AcceptShutdown()
{
    cancleShutdown = true;
    ShutdownSystem();
}

public void CancelShutdown()
{
    cancleShutdown = true;
}

private IEnumerator WaitForPowerRestore()
{
    yield return new WaitForSeconds(3);

    if(!systemPower)
    {
        powerOffWarningWindow.Show();
        StartCoroutine(OpenShutdownWarning());
    }
}

private IEnumerator OpenShutdownWarning()
{
    float time = 5;

    while (time > 0)
    {
        powerOffWarningWindow.UpdateText(time);
        if (cancleShutdown)
        {
            cancleShutdown = false;
            yield break;
        }
        time -= Time.deltaTime;
        yield return null;
    }

    ShutdownSystem();
}

private void ShutdownSystem()
{
    SaveManager.Save();
    Send("off");
    LeanTween.alphaCanvas(canvasGroup, 1, 0.5f);

    Invoke(nameof(Shutdown), 0.6f);
}

private void Shutdown()
{
    string s = LinuxCommand.Run("sudo sleep 5s; sudo shutdown -h now");
    Application.Quit();
}
```
