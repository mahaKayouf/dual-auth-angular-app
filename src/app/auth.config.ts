import { BrowserCacheLocation, Configuration, LogLevel } from "@azure/msal-browser";
import { environment } from "src/environments/environment";

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const msalConfig: Configuration = {
    auth: {
        clientId: environment.azureAD.clientId,
        authority: environment.azureAD.authority,
        redirectUri: '/',
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE,
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                console.log(message);              
            },
            logLevel: LogLevel.Verbose
        }
    }
}

export const protectedResources = {
    getnameApi: {
        endpoint: "https://localhost:44356/api/names/getname",
        scopes: ["api://b6d6bb77-8efd-4b44-ac77-47b824039e8c/ClientScope"]
    }
}

export const loginRequest = {
    scopes: []
}