//data file
const url = "samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//Fetch the JSON data and console log it
//use python -m http.server to launch the server before running
d3.json(url).then(function (Newdata) {
    console.log(Newdata);

    let data = Newdata;

    let drop_down_id = data.names;

    drop_down_id.forEach((id) => {
        d3.select('#selDataset').append('option').text(id);


    });
})
//Fetch the JSON data and console log it
d3.json(url).then(function (Newdata) {
    console.log(Newdata);
    //Set the default value for the dropdown ID
    let data = Newdata;
    sample_id = data.samples.filter(samples => samples.id === "940")[0];
    console.log(sample_id)

    let otu_ids = sample_id.otu_ids;
    let sample_values = sample_id.sample_values;
    let otu_labels = sample_id.otu_labels

    console.log(otu_ids)
    console.log(otu_labels)
    console.log(sample_values)

    // Initializes the page with a default plot
    // Slice the first 10 objects for plotting
    let x_data = sample_values.slice(0, 10).reverse();
    let y_data = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    let bar_labels = otu_labels.slice(0, 10).reverse();

    let bar_chart = [{

        x: x_data,
        y: y_data,
        labels: bar_labels,
        type: "bar",
        orientation: "h",

    }
    ];
    let layout = {
        title: "Top 10 OTU Samples",

    }
    Plotly.newPlot("bar", bar_chart, layout);


    let bubble_chart = [{

        x: x_data,
        y: y_data,
        labels: bar_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }

    }
    ];
    let layout1 = {
        title: "OTU_ID"
    }
    //show the bubble plot 
    Plotly.newPlot("bubble", bubble_chart, layout1);

    // default id
    w_data = data.metadata.filter(sample => sample.id === 940)[0];
    let wash_f = w_data.wfreq


    //https://plotly.com/javascript/gauge-charts/
    //set the values for the gauge chart

    let gauge_chart = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_f,
        title: "Weekly Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 1], color: '#CCFFCC' },
                { range: [1, 2], color: '#CCFF99' },
                { range: [2, 3], color: '#00FF00' },
                { range: [3, 4], color: '#00CC33' },
                { range: [4, 5], color: '#66CC66' },
                { range: [5, 6], color: '#00CC00' },
                { range: [6, 7], color: '#009900' },
                { range: [7, 8], color: '#006600' },
                { range: [8, 9], color: '#006633' },
            ],

        }

    }];

    let layout2 = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    //show the gauge chart
    Plotly.newPlot("gauge", gauge_chart, layout2);


    // DEMOGRAPHIC INFO
    updated_sample = data.metadata.filter(sample => sample.id === 940)[0];

    // Display each key-value pair from the metadata JSON object
    Object.entries(updated_sample).forEach(
        ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");
        console.log(dataset)

        //Update the data on Id selection
        updated_id = data.samples.filter(sample => sample.id === dataset)[0];

        let otu_id = updated_id.otu_ids;
        let sample_value = updated_id.sample_values;
        let otu_label = updated_id.otu_labels


        // Initializes the page with a default plot
        let x_info = sample_value.slice(0, 10).reverse();
        let y_info = otu_id.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        let bar_text = otu_label.slice(0, 10).reverse();

        //restyle the bar chart once new id value is selected
        Plotly.restyle("bar", "x", [x_info]);
        Plotly.restyle("bar", "y", [y_info]);
        Plotly.restyle("bar", "text", [bar_text]);
        // restyle bubble chart once new id value is selected
        Plotly.restyle("bubble", "x", [x_info]);
        Plotly.restyle("bubble", "y", [y_info]);
        Plotly.restyle("bubble", "labels", [otu_label]);
        Plotly.restyle("bubble", "marker.color", [otu_id]);
        Plotly.restyle("bubble", "marker.size", [sample_value])


        // DEMOGRAPHIC INFO
        m_data = data.metadata.filter(sample => sample.id == dataset)[0];

        // Clear out current contents in the panel
        d3.select("#sample-metadata").html("");


        // Display each key-value pair from the metadata JSON object
        Object.entries(m_data).forEach(
            ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

        //update the gauge chart info once new value is selected

        let updated_data = m_data.wfreq

        Plotly.restyle("gauge", "value", [updated_data]);


    }


})

