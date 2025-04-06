// Initialize VanillaTilt
function vanillaTilt(element) {
    VanillaTilt.init(document.querySelector(element), {
        max: 10,
        speed: 200,
        glare: true,
        "max-glare": 0.5,
    });
}

// Apply tilt effect to info elements when the page loads
document.addEventListener("DOMContentLoaded", () => {
    vanillaTilt(".info1");
    vanillaTilt(".info2");
    vanillaTilt(".info3");

    // Form submission handling
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    const form_name = document.getElementById("fname");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const submit = document.getElementById("submit");

    submit.addEventListener("click", () => {
        if (
            form_name.value === "" ||
            email.value === "" ||
            subject.value === "" ||
            message.value === ""
        ) {
            alert("All fields are required");
            return;
        } else {
            submitEmail();
        }
    });

    function submitEmail() {
        const templateParams = {
            from_name: form_name.value,
            from_email: email.value,
            to_name: "Shuvro!",
            subject: subject.value,
            message: message.value,
        };

        // Use EmailJS service (initialized in main.js)
        emailjs.send(
            window.emailjsServiceId, 
            window.emailjsTemplateId, 
            templateParams
        )
            .then(function(response) {
                alert("SUCCESS! " + response.status + " " + response.text);
                // Clear form fields after successful submission
                form_name.value = "";
                email.value = "";
                subject.value = "";
                message.value = "";
            }, function(error) {
                alert("FAILED... " + error);
            });
    }
});

// Initialize Mapbox
export function initMap() {
    if (!window.mapboxgl) return;
    
    const mapboxToken = window.mapboxToken || "";
    if (!mapboxToken) {
        console.warn("Mapbox token not found");
        return;
    }
    
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        style: "mapbox://styles/mapbox/light-v10",
        center: [90.3911645, 23.7494284], // Longitude, latitude
        zoom: 18.5, // Zoom level
        pitch: 45,
        bearing: -17.6,
        container: "map", // Our #map target.
        antialias: true,
    });

    map.on("load", function () {
        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;

        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
            if (
                layers[i].type === "symbol" &&
                layers[i].layout["text-field"]
            ) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        map.addLayer(
            {
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                    "fill-extrusion-color": "#aaa",

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                    ],
                    "fill-extrusion-opacity": 0.6,
                },
            },
            labelLayerId
        );
    });
} 