# Travel Planner

A professional full-stack Travel Planner web application developed using Java Spring Boot, HTML, CSS, and JavaScript. This project allows users to add travel destinations, visualize them on a map, calculate total distance and travel time, and manage a road trip interactively.

## Features

- Add travel destinations by entering a city or place name
- Convert place names into latitude and longitude using OpenStreetMap Nominatim API
- Display all destinations on an interactive map
- Draw a route between destinations
- Calculate and display:
  - Total travel distance
  - Estimated travel time
- Delete destinations from the trip
- Responsive and professional UI
- Frontend and backend integration using REST APIs

## Technologies Used

- Java 21
- Spring Boot
- Maven
- HTML5
- CSS3
- JavaScript
- Leaflet
- OpenStreetMap
- Font Awesome

## Project Structure

```text
travelplanner/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/travelplanner/
│       ├── TravelPlannerApplication.java
│       ├── controller/
│       │   └── TripController.java
│       ├── model/
│       │   ├── Destination.java
│       │   └── TripSummary.java
│       └── service/
│           └── TripService.java
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
