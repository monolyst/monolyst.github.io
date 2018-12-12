(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "RouteTimesID",
            dataType: tableau.dataTypeEnum.string
         }, {
            id: "bus_tti",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "gp_tti",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "baseline_bus_tti",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "baseline_gp_tti",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "hour",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "TravelDate",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "routetimes",
            alias: "routetimes",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://ezrhp3xg6f.execute-api.us-east-1.amazonaws.com/v1/routetimes/", function(resp) {
            var feat = resp["results"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "RouteTimesID": feat[i].RouteTimesID,                
                    "bus_tti": feat[i].bus_tti,
                    "gp_tti": feat[i].gp_tti,
                    "baseline_bus_tti": feat[i].baseline_bus_tti,
                    "baseline_gp_tti": feat[i].baseline_gp_tti,
                    "hour": feat[i].hour,    
                    "TravelDate": feat[i].TravelDate
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "SDOT RouteTimes Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
