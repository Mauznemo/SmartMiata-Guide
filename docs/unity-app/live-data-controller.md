---
sidebar_position: 5
---

# Communicating with the live data controller

:::note
I called the script `GpsController.cs`, but a better name is `LiveDataController.cs` so just name it that.
:::

The first thing we need to do is to create the script and inherit it from `BaseArduinoCommunication`.

```cs
public class GpsController : BaseArduinoCommunication
{
    
}
```

## Variables
Now we need to define some variables.

```cs
public static GpsController Instance { get; private set; }

public static event Action<bool> OnGpsSignal;
public static event Action<string> OnDateAndTime;
```
We again use a singleton and two events for other scripts to subscribe to.

```cs
public static float speedKmh { private set; get; }
public static float rpm { private set; get; }
public static float smoothedRpm { private set; get; }
public static float highestRpm { private set; get; }
```

Then we need some static variables so that we can access them from everywhere really easily.

```cs
[SerializeField] private AnimationCurve speedDisplayRemap;

[SerializeField] private float wheelRotationSpeedMultiplier;

[SerializeField] private TMP_Text upperText;
[SerializeField] private TMP_Text lowerText;

[SerializeField] private Button modeButton;

[SerializeField] private FreeLookInput freeLookInput;

[SerializeField] private Transform[] wheelMeshes;

[SerializeField] private int smoothingFactorRpm = 5;
```

Now some variables that can be assigned from the unity editor.

```cs
private bool setCamera;
private float resetTime = 30;
private float rotateTime = 2;

private bool hasSignal;

private bool inReverse;

private Thread serialThread;
private bool isRunning = false;

private bool displayState;

private List<float> rpmReadings = new List<float>();

private float smoothingFactorSpeed = 0.5f;

private float smoothedSpeed = 0f;

private int messagesToIgnore = 10;
private int messagesReceived;
```

And lastly some private variables.

## Awake()
In here we need to set the Instance and subscribe to the button even if you want to be able to switch between the RPM and speed display.
```cs
private void Awake()
{
    Instance = this;

    modeButton.onClick.AddListener(() =>
    {
        displayState = !displayState;
        SetSpeed();
        SetRPM();
    });
}  
```

## Start() and serial reading
In `Start()` we need to add similar code as the main microcontroller had.

```cs
private void Start()
{
    upperText.text = "--";
    OnGpsSignal?.Invoke(false);

    if (string.IsNullOrEmpty(portName))
        portName = SaveManager.Load().gpsController.arduinoPort;
    Init();

    MicroController.OnForward += MicroController_OnForward;
    MicroController.OnReverse += MicroController_OnReverse;

    StartSerialThread();
}

private void MicroController_OnReverse()
{
    inReverse = true;
}

private void MicroController_OnForward()
{
    inReverse = false;
}

private void OnDestroy()
{
    StopSerialThread();
}

private void StartSerialThread()
{
    if (isRunning)
        return;

    isRunning = true;
    serialThread = new Thread(ReadSerialData);
    serialThread.Start();
}

private void ReadSerialData()
{
    while (isRunning)
    {
        ReadLatestMessage();
        // Wait for 0.1 seconds
        Thread.Sleep(1);
    }
}

private void StopSerialThread()
{
    isRunning = false;
    serialThread.Join();
}
```
Here we also subscribe to two events of the main microcontroller so that we know if the car is in reverse or not.

We also can't just read the serial port in `Update()` like for the other Arduinos, because the constant sending of data from this Arduino would slow down the entire application. This is why we run it in a separate thread.

## Update()

In `Update()` we need to animate the wheel meshes according to the current speed.

```cs
 private void Update()
 {
     UpdateWheels();

     if(inReverse)
     {
         speedKmh = -speedKmh;
     }
 }

 private void UpdateWheels()
 {
     float rotationAngle = speedKmh * Time.deltaTime * wheelRotationSpeedMultiplier;

     for (int i = 0; i < wheelMeshes.Length; i++)
     {
         if(i < 2)
             wheelMeshes[i].Rotate(-rotationAngle, 0, 0, Space.Self);
         else
             wheelMeshes[i].Rotate(rotationAngle, 0, 0, Space.Self);
     }
 }
```

If you also want that your camera moves behind the car when you start driving you can add this to `Update()`.

```cs
if (speedKmh > 10 && !setCamera)
    {
        rotateTime -= Time.deltaTime;
        if(rotateTime <= 0)
        {
            setCamera = true;
            freeLookInput.FollowCamView();
            rotateTime = 2;
        }
    }

    if(setCamera)
    {
        if (speedKmh <= 0.1f)
        {
            resetTime -= Time.deltaTime;
            if (resetTime <= 0)
            {
                setCamera = false;
            }
        }
        else
        {
            resetTime = 30;
        }
    }       
```

## Handling received data

This is the code we need for the received function.

```cs
 public override void Received(string message)
 {
     if(messagesReceived < messagesToIgnore)
     {
         messagesReceived++;
         return;
     }

     if (!string.IsNullOrEmpty(message))
     {
         if (message.Contains("time"))
         {
             OnDateAndTime?.Invoke(message);
             return;
         }

         try
         {
             string[] strings = message.Split("_");

             float s = float.Parse(strings[1], CultureInfo.InvariantCulture);
             float r = float.Parse(strings[0], CultureInfo.InvariantCulture);

             if (s != -1)
             {
                 speedKmh = s;
             }

             rpm = r;

             if(rpm > highestRpm)
             {
                 highestRpm = rpm;
             }

             smoothedSpeed = smoothingFactor * speedKmh + (1 - smoothingFactor) * smoothedSpeed;
             UpdateRPM(rpm);

             SetSpeed();
             SetRPM();

             if (s == -1)
                 return;

             if (!hasSignal)
             {
                 OnGpsSignal?.Invoke(true);
             }
             hasSignal = true;
         }
         catch (Exception e)
         {

         }
     }
 }
```

We ignore the first 10 messages because the beginning sometimes gets cut of and if the Arduino sends `-1`, but we get `1` it would mess up some things.

Then we parse the numbers and do a bit of smoothing to the values.

Here is the rest of the code with all the functions:

```cs
public void UpdateRPM(float newRPM)
{
    rpmReadings.Add(newRPM);

    if (rpmReadings.Count > smoothingFactorRpm)
    {
        rpmReadings.RemoveAt(0);
    }

    smoothedRpm = rpmReadings.Average();
}

public void SetSpeed()
{
    if (displayState)
    {
        lowerText.text = $"{Mathf.Round(GetRemappedSpeed(smoothedSpeed))} km/h";

        if (inReverse)
        {
            lowerText.text += " R";
        }
    }
    else
    {
        upperText.text = $"{Mathf.Round(GetRemappedSpeed(smoothedSpeed))}";

        if (inReverse)
        {
            upperText.text += " R";
        }
    }
}

public void SetRPM()
{
    if (displayState)
    {
        upperText.text = $"<size=39>{smoothedRpm.ToString("0.00")}K</size>";
    }
    else
    {
        lowerText.text = $"{smoothedRpm.ToString("0.00")}K RPM";
    }
}

private float GetRemappedSpeed(float speed)
{
    float remappedSpeed = speedDisplayRemap.Evaluate(speed);

    if(speed > GetMaxTimeOfCurve(speedDisplayRemap))
        return speed;
    else
        return remappedSpeed;
}

private float GetMaxTimeOfCurve(AnimationCurve curve)
{
    float maxTime = 0f;

    foreach (Keyframe key in curve.keys)
    {
        if (key.time > maxTime)
        {
            maxTime = key.time;
        }
    }

    return maxTime;
}
```