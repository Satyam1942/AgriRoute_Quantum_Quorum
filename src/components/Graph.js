import React from "react";
import Graph from "react-graph-vis-ts";
import Fab from '@mui/material/Fab';
import DatasetIcon from '@mui/icons-material/AutoAwesome';
import axios from "axios";
import { useState } from 'react';
import { Typography } from "@mui/material";

const GraphComponent = ({ data }) => {
    const [resultData, setResultData] = useState(null);
    const [graphData, setGraphData] = useState(data);

    const options = {
        layout: {
            hierarchical: false,
        },
        physics: {
            enabled: true, // Enable physics animations
            solver: "forceAtlas2Based", // Use the ForceAtlas2 algorithm for smooth movements
            timestep: 0.1, // Lower the timestep for slower animations (default is 1)
            maxVelocity: 10, // Reduce max velocity to make nodes move slower
            forceAtlas2Based: {
                gravitationalConstant: -30, // Adjust repulsive force strength
                centralGravity: 0.002, // Reduce pull towards the center
                springLength: 200, // Length of the edges (affects node spacing)
                springConstant: 0.01, // Lower stiffness for smoother movement
                avoidOverlap: 1, // Avoid overlapping nodes
            },
            stabilization: {
                enabled: true,
                iterations: 1000, // Increase iterations for smoother transitions
                updateInterval: 50, // Update less frequently for smoother appearance
            },
            adaptiveTimestep: true, // Adapt time steps for smoother animations
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
        },
        edges: {
            color: "#000000",
        },
        nodes: {
            font: {
                size: 14,
                color: "#000000",
            },
        },
    };

    const handleApiCall = async () => {
        const payload = {
            farms: data.farms.map(farm => ({
                id: parseInt(farm.id.replace('Farm-', '')) - 1, // Convert "Farm-1" to 1
                // Keep other properties of the farm
                quantity: farm.quantity,
                perishability: farm.perishability
            })),
            hubs: data.hubs.map(hub => ({
                id: parseInt(hub.id.replace('Hub-', '')) - 1,  // Convert "Hub-1" to 1
                // Keep other properties of the hub

                capacity: hub.capacity,
                cost: hub.cost,
            })),
            centers: data.centers.map(center => ({
                id: parseInt(center.id.replace('Center-', '')) - 1,  // Convert "Center-1" to 1
                // Keep other properties of the center
                demand: center.demand
            })),
            farm_to_hub_dist: data.farm_to_hub_dist,
            hub_to_center_dist: data.hub_to_center_dist,
        };



        console.log(payload);
        try {
            const result = await axios.post("http://127.0.0.1:5000/api/optimize", payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setResultData(result.data);
            console.log("API Response:", result.data);
            const updatedEdges = graphData.edges.map(edge => {
                const isInPath = result.data.NovelAlgorithm?.Path.some(
                    step =>
                        (edge.from === `Farm-${step.farm + 1}` && edge.to === `Hub-${step.hub + 1}`) ||
                        (edge.from === `Hub-${step.hub + 1}` && edge.to === `Center-${step.center + 1}`)
                );
                return {
                    ...edge,
                    color: isInPath ? "red" : edge.color // Change color to green if part of the path
                };
            });

            setGraphData({
                ...graphData,
                edges: updatedEdges,
            });
        } catch (error) {
            console.error("Error calling API:", error.message);
            if (error.response) {
                console.error("API Response Error:", error.response.data);
            } else if (error.request) {
                console.error("No Response from API:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
        }
    };


    return (
        <div
            style={{
                height: "550px",
                width: "75%",
                border: "5px solid #ccc", // Adding border
                borderRadius: "5px", // Rounded corners
                backgroundColor: "#f2f2f2cc", // Transparent background
                padding: "10px", // Padding inside the div
                marginLeft: "160px",
                marginTop: "20px", // Top margin
            }}

        >
            <Fab
                variant="extended"

                style={{
                    position: 'absolute',
                    left: '50%',
                    marginTop: '480px',
                    backgroundColor: '#f0f4c3',
                    marginLeft: '350px',
                    transform: 'translate(-50%, -50%)', // Centering horizontally and vertically
                    transition: 'transform 0.3s ease', // Smooth transition
                }}
                sx={{
                    '&:hover': {
                        transform: 'scale(1.5)', // Increase the size on hover
                    },
                }}

                onClick={handleApiCall}
            >
                <DatasetIcon sx={{ mr: 1 }} />
                Run Algorithm

            </Fab>
            {data && data.nodes.length > 0 ? (
                <Graph
                    graph={graphData}
                    options={options}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                />

            ) : (
                <p style={{ textAlign: "center" }}>No graph data to display</p>
            )}


            {resultData && (
                <div style={{
                    width: "100%",
                    border: "5px solid #ccc", // Adding border
                    borderRadius: "5px", // Rounded corners
                    backgroundColor: "#f2f2f2cc", // Transparent background
                    padding: "10px", // Padding inside the div
                    marginLeft: "-15px",
                    marginTop: "70px", // Top margin
                    display: "flex", // Enable flexbox layout
                    flexDirection: "column", // Align children in a column (vertically)
                    justifyContent: "center", // Vertically center the content
                    alignItems: "center", // Horizontally center the content
                    textAlign: "center"
                }}>
                    <Typography variant="h3" gutterBottom>
                        Results:
                    </Typography>

                    <Typography variant="h5" paragraph>
                        <Typography variant="h5" paragraph>
                            <strong>Genetic Algorithm:</strong>
                            <div>
                                <Typography variant="h6">Cost: {resultData.NovelAlgorithm?.Cost}</Typography>
                                <Typography variant="h6">Execution Time: {resultData.NovelAlgorithm?.ExecutionTime}</Typography>
                                <Typography variant="h6">
                                    <strong>Path:</strong>
                                    {resultData.NovelAlgorithm?.Path.map((step, index) => (
                                        <div key={index}>
                                            {`Farm ${step.farm + 1} -> Hub ${step.hub + 1} -> Center ${step.center + 1}`}
                                            <br />
                                        </div>
                                    ))}
                                </Typography>
                            </div>
                        </Typography>
                    </Typography>

                    <Typography variant="h5" paragraph>
                        <strong>Greedy Heuristics:</strong>
                        <div style={{ flexDirection: "row" }}>
                            <Typography variant="h6">Cost: {resultData.GreedyHeuristics?.Cost}</Typography>
                            <Typography variant="h6">Execution Time: {resultData.GreedyHeuristics?.ExecutionTime}</Typography>
                        </div>
                    </Typography>

                    <Typography variant="h5" paragraph>
                        <strong>Linear Programming:</strong>
                        <div>
                            <Typography variant="h6"> Cost: {resultData.LinearProgramming?.Cost}</Typography>
                            <Typography variant="h6"> Execution Time: {resultData.LinearProgramming?.ExecutionTime}</Typography>
                        </div>
                    </Typography>
                </div>
            )}


        </div>

    );
};

export default GraphComponent;
