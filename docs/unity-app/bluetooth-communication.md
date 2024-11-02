---
sidebar_position: 6
---

# Bluetooth communication

## What we need

To do all the Bluetooth things from in Unity, like connecting, pairing and controlling the media player, a bit of work is needed.

So we need some way to control all the things that are relevant for Bluetooth from in Unity.

## How I did it

On Linux there is this nice command line tool [`bluetoothctl`](https://linuxcommandlibrary.com/man/bluetoothctl).

So I made a script that uses terminal commands inside of Unity for example this to get the devices.

```cs
public List<BluetoothDevice> ListConnectedDevices()
{
    string devices = LinuxCommand.Run("bluetoothctl devices Connected");
    return BluetoothParser.ParseDevices(devices);
}
```

And to get events like when a new device is available to connect I'm running an instance of `bluetoothctl` from in Unity using the [`Process`](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process?view=net-8.0) class from `System.Diagnostics`.

So I wrote a script that has all the functions we need and events you can subscribe to. I did this by using `string.Contains()` it is probably not the most optimized, but it works fine.

## How you can use it

If you are fine with it probably not being the most optimized code to do this you can just use mine.

I also have the project for Bluetooth Control on GitHub [UnityBluetoothControl-Linux](https://github.com/Mauznemo/UnityBluetoothControl-Linux/tree/main), so you can just download it and have a look how it works.

### Code example

Here is a code sipped of how a part of the UI code could look like if you are using my `BluetoothManager.cs` script.
```cs
using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Mauznemo.LinuxBluetooth;

public class BluetoothUI : MonoBehaviour
{
    [SerializeField] private Button scanButton;
    [SerializeField] private Button lockButton;
    [SerializeField] private TMP_Text lockButtonText;
    [SerializeField] private TMP_Text scanButtonText;

    [SerializeField] private DeviceEntry deviceEntryPrefab;
    [SerializeField] private Transform deviceEntryParent;
    [SerializeField] private Transform transformPaired;
    [SerializeField] private Transform transformFound;

    private bool blocked;

    private void Start()
    {
        blocked = BluetoothManager.Instance.IsSoftBlocked();
        lockButtonText.text = blocked ? "Bluetooth: Off" : "Bluetooth: On";

        scanButton.onClick.AddListener(() => 
        {
            BluetoothManager.Instance.SetScan(true);
            scanButtonText.text = "Scanning...";
        });
        lockButton.onClick.AddListener(() =>
        {
            blocked = !blocked;
            BluetoothManager.Instance.SetBluetoothBlock(blocked);
            lockButtonText.text = blocked ? "Bluetooth: Off" : "Bluetooth: On";
        });

        BluetoothManager.OnDeviceFound += HandleDeviceFound;
        BluetoothManager.OnConfirmPasskey += HandleConfirmPasskey;

        ShowPairedDevices();
    }

    private void HandleConfirmPasskey(string obj)
    {
        ModalWindow.Create().Init("Passkey", $"Confirm passkey: {obj}", ModalWindow.ModalType.YesNo, () =>
        {
            BluetoothManager.Instance.ConfirmPasskey();
        }, () => { });
    }

    private void HandleDeviceFound((string macAddress, string name, bool paired) device)
    {
        int index;
        if (device.paired)
        {
            index = transformPaired.GetSiblingIndex();
        }
        else
        {
            index = transformFound.GetSiblingIndex();
        }

        DeviceEntry deviceEntry = Instantiate(deviceEntryPrefab, deviceEntryParent);
        deviceEntry.gameObject.SetActive(true);
        deviceEntry.transform.SetSiblingIndex(index + 1);
        deviceEntry.Init(new BluetoothDevice
        {
            name = device.name,
            macAddress = device.macAddress
        });
    }

    private void ShowPairedDevices()
    {
        var devices = BluetoothManager.Instance.ListPairedDevices();
        foreach (var device in devices)
        {
            BluetoothManager.Instance.HandleNewDevice(device.name, device.macAddress, true);
        }
    }
}
```

You can for example subscribe to the event `BluetoothManager.OnDeviceFound` to call a function when a new Bluetooth device is available.

Or this to get if Bluetooth is turn on or off:
```cs
blocked = BluetoothManager.Instance.IsSoftBlocked();
lockButtonText.text = blocked ? "Bluetooth: Off" : "Bluetooth: On";
```

And to turn it back on (toggle it) for example you can do:
```cs
blocked = !blocked;
BluetoothManager.Instance.SetBluetoothBlock(blocked);
lockButtonText.text = blocked ? "Bluetooth: Off" : "Bluetooth: On";
```

I also tried keeping the function names similar to the original ones from `bluetoothctl`.