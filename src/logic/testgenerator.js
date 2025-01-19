// Random number generator functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

// Generate random test case
export function generateTestCase() {
    const numFarms = getRandomInt(3, 30);
    const numHubs = getRandomInt(2, 10);
    const numCenters = getRandomInt(1, 5);

    const farms = Array.from({ length: numFarms }, (_, id) => ({
        id: `Farm-${id + 1}`,
        type: "Farm",
        quantity: getRandomInt(50, 200),
        perishability: getRandomInt(1, 7)
    }));

    const hubs = Array.from({ length: numHubs }, (_, id) => ({
        id: `Hub-${id + 1}`,
        type: "Hub",
        capacity: getRandomInt(50, 200),
        cost: getRandomInt(50, 100),
    }));

    const centers = Array.from({ length: numCenters }, (_, id) => ({
        id: `Center-${id + 1}`,
        type: "Center",
        demand: getRandomInt(100, 300)
    }));

    const nodes = [
        ...farms.map((farm) => ({
            id: farm.id,
            label: farm.id,
            shape: "circle",
            color: "#28a745", // Green for farms
        })),
        ...hubs.map((hub) => ({
            id: hub.id,
            label: hub.id,
            shape: "box",
            color: "#ffc107", // Yellow for hubs
        })),
        ...centers.map((center) => ({
            id: center.id,
            label: center.id,
            shape: "triangle",
            color: "#007bff", // Blue for centers
        })),
    ];

    const edges = [];
    farms.forEach((farm) => {
        hubs.forEach((hub) => {
            edges.push({
                from: farm.id,
                to: hub.id,
                label: `${getRandomFloat(1, 100)} km`,
            });
        });
    });

    hubs.forEach((hub) => {
        centers.forEach((center) => {
            edges.push({
                from: hub.id,
                to: center.id,
                label: `${getRandomFloat(1, 100)} km`,
            });
        });
    });


    const farm_to_hub_dist = [];  // Array to store distances between farms and hubs
    const hub_to_center_dist = [];  // Array to store distances between hubs and centers

    // Iterate over edges to separate distances
    edges.forEach((edge) => {
        const distance = parseFloat(edge.label.replace(" km", "")); // Extract the numeric value

        if (edge.from.startsWith("Farm") && edge.to.startsWith("Hub")) {
            // Extract farm and hub IDs from their respective labels and store the distance
            const farmId = parseInt(edge.from.replace('Farm-', '')) - 1;
            const hubId = parseInt(edge.to.replace('Hub-', '')) - 1;

            // Ensure farm_to_hub_dist has the right structure
            if (!farm_to_hub_dist[farmId]) {
                farm_to_hub_dist[farmId] = [];
            }

            farm_to_hub_dist[farmId][hubId] = distance;  // Store distance in the correct place
        } else if (edge.from.startsWith("Hub") && edge.to.startsWith("Center")) {
            // Extract hub and center IDs from their respective labels and store the distance
            const hubId = parseInt(edge.from.replace('Hub-', '')) - 1;
            const centerId = parseInt(edge.to.replace('Center-', '')) - 1;

            // Ensure hub_to_center_dist has the right structure
            if (!hub_to_center_dist[hubId]) {
                hub_to_center_dist[hubId] = [];
            }

            hub_to_center_dist[hubId][centerId] = distance;  // Store distance in the correct place
        }
    });


    return { nodes, edges, farms, hubs, centers, farm_to_hub_dist, hub_to_center_dist };
}
