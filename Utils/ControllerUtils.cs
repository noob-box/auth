using Microsoft.AspNetCore.Mvc;

namespace NBOX.Auth.Utils;

public static class ControllerUtils
{
    public static string GetControllerRoute<T>() where T : ControllerBase
    {
        return typeof(T).Name.Replace("Controller", "");
    }
}