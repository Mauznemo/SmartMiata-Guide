---
sidebar_position: 2
---

# Interacting with the 3D preview

If you want to be able to tap on the popups or anything else and have it do something you can do it like follows.

## Base class

First I created a base class again, because I wanted a click effect and an outline for the currently selected object.

I used the [HighlightPlus asset](https://assetstore.unity.com/packages/vfx/shaders/highlight-plus-all-in-one-outline-selection-effects-134149) for this, but you can look if you find something free.

```cs
using HighlightPlus;
using System;
using UnityEngine;

public class BaseSelectableObject : MonoBehaviour
{
    public static event Action OnHideAllOutlines;

    private HighlightEffect highlightEffect;

    protected void Init()
    {
        highlightEffect = GetComponent<HighlightEffect>();
        OnHideAllOutlines += BaseSelectableObject_OnHideAllOutlines;
    }

    private void BaseSelectableObject_OnHideAllOutlines()
    {
        highlightEffect.highlighted = false;
    }

    protected void OutlineEffect()
    {
        OnHideAllOutlines?.Invoke();

        highlightEffect.highlighted = true;
        highlightEffect.HitFX();
    }

    public static void HideAllOutlines()
    {
        OnHideAllOutlines?.Invoke();
    }
}
```

## Popup script

Here is the script I used for the left popup to wink when I click it.

You also need a collider for `OnMouseUpAsButton()` to work.

```cs
public class LeftLight : BaseSelectableObject
{
    private void Start()
    {
        Init();
    }

    private void OnMouseUpAsButton()
    {
        if (Utilities.IsOverUI()) { return; }

        OutlineEffect();

        LightController.Instance.WinkLeft();
    }
}
```

To access the Light controller from everywhere without an extra reference you have to make it a [singleton](https://docs.unity3d.com/Packages/com.unity.entities@1.0/manual/components-singleton.html#:~:text=A%20singleton%20component%20is%20a,no%20longer%20a%20singleton%20component.).

To do this you just have to add this to the code of `LightController.cs`:

```cs
public class LightController : BaseArduinoCommunication
{
    public static LightController Instance { get; private set; }

    private void Awake()
    {
        Instance = this;

        //Other code that was in Awake
    }
}
```

To deselect when you click somewhere else you can add a collider and this script to the ground.

```cs
public class Deselect : MonoBehaviour
{
    private void OnMouseDown()
    {
        BaseSelectableObject.HideAllOutlines();
    }
}
```

