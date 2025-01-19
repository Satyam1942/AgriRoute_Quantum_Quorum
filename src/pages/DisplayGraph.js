import React, { useState, useEffect } from "react";
import { generateTestCase } from "../logic/testgenerator"; // Import the testcase generator function
import GraphComponent from "../components/Graph"; // Import the GraphComponent
import BackgroundSlideshow from "../components/BackgroundSlideshow";
import { Typography } from "@mui/material";

const GraphPage = () => {
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        // Generate the test case when the component mounts
        const data = generateTestCase();
        setGraphData(data); // Set the generated data into state
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <BackgroundSlideshow />
            <Typography variant="h3" component="h2"  style={{ textAlign: 'center' }}>
                Generated Graph
            </Typography>

            {graphData ? (
                <GraphComponent data={graphData} /> // Pass the generated data as a prop to GraphComponent
            ) : (
                <p>Loading graph...</p> // Show loading message while the data is being generated
            )}
            
        </div>
    );
};

export default GraphPage;
