# service-worker
Optimised Pixel Handler


Bonus Question - 

In case the user goes offline and keeps interacting with the website, pixels being fired
will be lost. Find a way to keep storing them and fire them later from the service worker when network connectivity is restored.


Answer - 

We can use `indexedDB` of `Storage` to store the requests from user when user goes offline.
And when network connectivity is restored then we can `sync requests before hitting the server`.

We can do it in these steps -

1 - Trigger `onsync` event which syncs requests using `event.waitUntil(syncIt())`.

2 - `syncIt` function work like this :

    function syncIt() {
        return getIndexedDB()
        .then(sendToServer)
        .catch(function(err) {
            return err;
        })
    }

3 - `getIndexedDB` function fetches all the stored requests.

4 - `sendToServer` function send the request to the server.


Here is the example link of the background sync process- 
https://davidwalsh.name/background-sync
