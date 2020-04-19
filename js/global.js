if (navigator.serviceWorker) {
    console.log('Service worker registration in progress.');
    navigator.serviceWorker.register('./js/service-worker.js')
    .then(registration => {
        console.log('Service worker registration complete.');
    })
    .catch(e => {
        console.log(e);
        console.log('Service worker registration failure.');
    });

    const img = new Image();
    img.src = '../images/pixel.gif';
    document.body.appendChild(img);
} else {
    console.log('Service Worker is not supported in this browser.');
}