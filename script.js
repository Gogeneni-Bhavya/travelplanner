const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let routeLine = null;

async function addDestination() {
    const input = document.getElementById('destinationInput');
    const place = input.value.trim();

    if (place === '') {
        alert('Enter a destination');
        return;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
        );

        const data = await response.json();

        if (data.length === 0) {
            alert('Destination not found');
            return;
        }

        const destination = {
            name: place,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
        };

        const saveResponse = await fetch('http://localhost:8080/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(destination)
        });

        if (!saveResponse.ok) {
            throw new Error('Could not save destination');
        }

        input.value = '';

        await loadDestinations();

    } catch (error) {
        console.error(error);
        alert('Backend is not running or destination could not be saved.');
    }
}

async function loadDestinations() {
    try {
        const response = await fetch('http://localhost:8080/api/trips');
        const destinations = await response.json();

        renderDestinations(destinations);

        await loadSummary();

    } catch (error) {
        console.error(error);
    }
}

async function loadSummary() {
    try {
        const response = await fetch('http://localhost:8080/api/trips/summary');
        const summary = await response.json();

        console.log('Trip Summary:', summary);

        document.getElementById('distance').innerText =
            summary.totalDistance !== undefined
                ? `${summary.totalDistance.toFixed(2)} km`
                : '0 km';

        document.getElementById('time').innerText =
            summary.totalTime !== undefined
                ? `${summary.totalTime.toFixed(2)} hrs`
                : '0 hrs';

    } catch (error) {
        console.error(error);

        document.getElementById('distance').innerText = '0 km';
        document.getElementById('time').innerText = '0 hrs';
    }
}

async function deleteDestination(index) {
    try {
        await fetch(`http://localhost:8080/api/trips/${index}`, {
            method: 'DELETE'
        });

        await loadDestinations();

    } catch (error) {
        console.error(error);
    }
}

function renderDestinations(destinations) {
    const list = document.getElementById('destinationList');
    list.innerHTML = '';

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (routeLine) {
        map.removeLayer(routeLine);
    }

    const routeCoordinates = [];

    destinations.forEach((destination, index) => {

        const marker = L.marker([destination.latitude, destination.longitude])
            .addTo(map)
            .bindPopup(`<b>${destination.name}</b>`);

        markers.push(marker);

        routeCoordinates.push([
            destination.latitude,
            destination.longitude
        ]);

        const li = document.createElement('li');

        li.innerHTML = `
            <div class="destination-info">
                <i class="fa-solid fa-location-dot"></i>
                <span>${destination.name}</span>
            </div>

            <button class="delete-btn" onclick="deleteDestination(${index})">
                Delete
            </button>
        `;

        list.appendChild(li);
    });

    if (routeCoordinates.length > 1) {
        routeLine = L.polyline(routeCoordinates, {
            color: '#2563eb',
            weight: 5
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), {
            padding: [50, 50]
        });

    } else if (routeCoordinates.length === 1) {
        map.setView(routeCoordinates[0], 10);
    }
}

loadDestinations();