(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "TrafficID",
            dataType: tableau.dataTypeEnum.string
         }, {
            id: "hour",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "baseline_delay_hours",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "delay_hours",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "base_volume_SLU_Inbound",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "base_volume_SLU_Outbound",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "base_volume_Sodo_Inbound",
            dataType: tableau.dataTypeEnum.float
        }, {          
            id: "base_volume_Sodo_Outbound",
            dataType: tableau.dataTypeEnum.float
        }, {         
            id: "volume_SLU_Inbound",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "volume_SLU_Outbound",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "volume_Sodo_Inbound",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "volume_Sodo_Outbound",
            dataType: tableau.dataTypeEnum.float
        }, {    
            id: "TravelDate",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "traffic",
            alias: "traffic",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://ezrhp3xg6f.execute-api.us-east-1.amazonaws.com/v1/traffic/", function(resp) {
            var feat = resp["results"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "TrafficID": feat[i].TrafficID,                
                    "hour": feat[i].hour,
                    "baseline_delay_hours": feat[i].baseline_delay_hours,
                    "delay_hours": feat[i].delay_hours,
                    "base_volume_SLU_Inbound": feat[i].base_volume_SLU_Inbound,
                    "base_volume_SLU_Outbound": feat[i].base_volume_SLU_Outbound,
                    "base_volume_Sodo_Inbound": feat[i].base_volume_Sodo_Inbound,                  
                    "base_volume_Sodo_Outbound": feat[i].base_volume_Sodo_Outbound,
                    "volume_SLU_Inbound": feat[i].volume_SLU_Inbound,
                    "volume_SLU_Outbound": feat[i].volume_SLU_Outbound,
                    "volume_Sodo_Inbound": feat[i].volume_Sodo_Inbound,                  
                    "volume_Sodo_Outbound": feat[i].volume_Sodo_Outbound,
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
            tableau.connectionName = "SDOT Traffic Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
