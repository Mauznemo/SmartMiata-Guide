---
sidebar_position: 1
---

# 3D preview

## Getting the model
You need a model of your car where all the parts you want to animate are lose and movable. You don't need to rig anything on it in Blender.

## Orbit camera
To make the orbit camera I used Cinemachine with the `CinemachineFreeLook`.

To control the camera with the mouse or touch screen I used the old input system, but you can also use the new input system.

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

[RequireComponent(typeof(CinemachineFreeLook))]
public class FreeLookInput : MonoBehaviour
{
    private CinemachineFreeLook freeLookCamera;

    private string XAxisName = "Mouse X";
    private string YAxisName = "Mouse Y";

    public float resetDuration = 0.5f; // Duration for setting the rotation

    private Coroutine resetCoroutine;

    private void Start()
    {
        freeLookCamera = GetComponent<CinemachineFreeLook>();
        freeLookCamera.m_XAxis.m_InputAxisName = "";
        freeLookCamera.m_YAxis.m_InputAxisName = "";
    }


    private void Update()
    {
        if (Input.GetMouseButton(0) && !Utilities.IsOverUI())
        {
            freeLookCamera.m_XAxis.m_InputAxisValue = -Input.GetAxis(XAxisName);
            freeLookCamera.m_YAxis.m_InputAxisValue = -Input.GetAxis(YAxisName);
        }
        else
        {
            freeLookCamera.m_XAxis.m_InputAxisValue = 0;
            freeLookCamera.m_YAxis.m_InputAxisValue = 0;
        }
    }

    public void FollowCamView()
    {
        SetRotation(new Vector2(180f, 0.67f));
    }

    public void SetRotation(Vector2 targetRotation)
    {
        if (resetCoroutine != null)
            StopCoroutine(resetCoroutine);

        resetCoroutine = StartCoroutine(SetRotationSmoothly(targetRotation));
    }

    IEnumerator SetRotationSmoothly(Vector2 targetRotation)
    {
        float elapsedTime = 0f;
        Vector2 startRotation = new Vector2(freeLookCamera.m_XAxis.Value, freeLookCamera.m_YAxis.Value);

        while (elapsedTime < resetDuration)
        {
            float t = elapsedTime / resetDuration;
            freeLookCamera.m_XAxis.Value = Mathf.Lerp(startRotation.x, targetRotation.x, t);
            freeLookCamera.m_YAxis.Value = Mathf.Lerp(startRotation.y, targetRotation.y, t);
            elapsedTime += Time.deltaTime;
            yield return null;
        }

        freeLookCamera.m_XAxis.Value = targetRotation.x;
        freeLookCamera.m_YAxis.Value = targetRotation.y;
    }
}
```

The `Utilities` class:

```cs
public static class Utilities
{
    /// <summary>Check if Pointer is over UI</summary>
    /// <returns><see cref="bool"/> <see langword="true"/> if Pointer is over UI</returns>
    public static bool IsOverUI()
    {
        PointerEventData pointerEventData = new PointerEventData(EventSystem.current) { position = Input.mousePosition };
        List<RaycastResult> results = new List<RaycastResult>();
        EventSystem.current.RaycastAll(pointerEventData, results);
        return results.Count > 0;
    }
}
```

