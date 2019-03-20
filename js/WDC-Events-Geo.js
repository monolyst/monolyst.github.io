(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "EventID",
            dataType: tableau.dataTypeEnum.string
        }, {    
            id: "TravelDate",
            dataType: tableau.dataTypeEnum.date
        }, {    
            id: "Lat",
            dataType: tableau.dataTypeEnum.float
        }, {                     
            id: "Lon",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Spatial_Lat",
            dataType: tableau.dataTypeEnum.float
        }, {                     
            id: "Spatial_Lon",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "Spatial_Order",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "events",
            alias: "events",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://ezrhp3xg6f.execute-api.us-east-1.amazonaws.com/v1/events-geo/", function(resp) {
            var feat = resp["results"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "EventID": feat[i].EventID,      
                    "TravelDate": feat[i].TravelDate,
                    "Lat": feat[i].Lat,    
                    "Lon": feat[i].Lon,
                    "Spatial_Lat": feat[i].Spatial_Lat,    
                    "Spatial_Lon": feat[i].Spatial_Lon,
                    "Spatial_Order": feat[i].Spatial_Order,
                    "Geometry": feat[i].Geometry
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
            tableau.connectionName = "SDOT Events Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
