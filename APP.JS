document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker Registered'));
    }

    document.getElementById('scanButton').addEventListener('click', scanForDevices);
});

async function scanForDevices() {
    try {
        const deviceList = document.getElementById('deviceList');
        deviceList.innerHTML = '';

        const options = { acceptAllDevices: true };
        const device = await navigator.bluetooth.requestDevice(options);
        
        const listItem = document.createElement('li');
        listItem.textContent = `${device.name} (${device.id})`;
        deviceList.appendChild(listItem);

        listItem.addEventListener('click', async () => {
            const server = await device.gatt.connect();
            console.log('Connected to GATT server');
            
            // Service and characteristic UUIDs should be updated to match the BLE device
            const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
            const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

            const selfDestructCommand = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0]);
            await characteristic.writeValue(selfDestructCommand);

            alert('Self-destruction sequence initiated');
        });
    } catch (error) {
        console.error(error);
        alert('Error: ' + error);
    }
}
