const siteUrl = "https://arquiconsult1.sharepoint.com/teams/PowerPlatformSandbox";
const libraryName = "Documents";
var file = "";
const flowUrl = 'https://prod-49.westeurope.logic.azure.com:443/workflows/8041cdd51555442aa5762044f624f445/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dA7b8B3JAm97_Qef-3cq-NZBWMvcK5830kzt3hnP8Kk';
var doctype;
var docname;
var file;
var doc;
var id;
var filename;





function openPage(executionContext) {

    formContext = executionContext;
    doctype = formContext.getAttribute("arq_doctype").getValue();
    docname = formContext.getAttribute("arq_name").getValue();
    //var doctype = formContext.getAttribute().getValue();
    //var doctype = formContext.getAttribute().getValue();
    id = formContext.data.entity.getId().slice(1, -1).toString();

    Xrm.Device.pickFile().then(

        function (data) {

            // attach the uploaded file as attachment to note
            var entity = {};
            //entity.subject = "Sample Subject";
            entity.documentbody = data[0].fileContent;
            entity.filename = data[0].fileName;
            entity.mimetype = data[0].mimeType;
            //entity.notetext = "Sample Text";
            // lead entity sample
            console.log(entity.documentbody);
            file = entity.documentbody;
            filename=entity.filename;



            console.log("navigate");


            getdoctype(function () {
                xmlrequest();
            }, function (error) {
                Xrm.Utility.alertDialog("Error occurred while getting document type. Please try again");
            });


        },
        function (error) {
            Xrm.Utility.alertDialog("Error occured while picking file. Please try again");
        }
    );
}



function xmlrequest() {
    console.log("XML REQUEST");

    var pageInput = {
        pageType: "custom",
        name: "arq_uploadpage_b2417",
    };
    
    var navigationOptions = {};

    var appendstring = `{
        "name": "${docname}",  
        "doctype": "${doc}",     
        "Id":"${id}",
        "Filename":"${filename}",
        "File":"${file}"
    }`;


    Xrm.Navigation.navigateTo(pageInput, navigationOptions)
        .then(
            function () {
                console.log("POP UP!")
            }
        ).catch(
            function (error) {
                console.log("ERROR => " + error)
            }
        );

    console.log("XML REQUEST 2");
    var req = new XMLHttpRequest();
    req.timeout = 1200000;
    req.open("POST", flowUrl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    console.log("XML REQUEST 2");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {

                console.log("before send");

                var alertStrings = { confirmButtonLabel: "Ok", text: "Your File was uploaded!" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //  formContext.data.refresh(true);

                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = "arq_documentlog";
                        entityFormOptions["entityId"] = id;



                        Xrm.Navigation.openForm(entityFormOptions).then(function () {
                            setTimeout(function () {

                                console.log("Log Documents2");
                                //console.log(formContext.ui.tabs.get("Log Documents"));
                                console.log("Log Documents3");
                                formContext.ui.tabs.get("Log Documents").setFocus();
                            }, 3000);
                        }, function (error) {
                            console.log("Error opening form: " + error.message);
                        });






                    },
                    function (error) {
                        console.log(error.message);
                    }
                );




                //uploadFile();

                // entity["objectid_lead@odata.bind"] = "/leads(" + entityId + ")";



            }
            else {
                formContext.ui.setFormNotification("An error occured generating your documents!", "ERROR", infoId);
            }
        }
    };
    console.log("XML REQUEST 2");

    req.send(appendstring);
    console.log("XML REQUEST 3");
}


// async function uploadFile() {

//     console.log("upload file");
//     if (file) {

//         console.log("");
//         // Convert base64-encoded file content to binary data
//         const binaryData = atob(file);
//         const fileByteArray = new Uint8Array(binaryData.length);

//         for (let i = 0; i < binaryData.length; i++) {
//             fileByteArray[i] = binaryData.charCodeAt(i);
//         }

//         // Create a Blob from binary data
//         const fileBlob = new Blob([fileByteArray]);

//         // SharePoint REST API endpoint
//         const endpointUrl = `${siteUrl}/_api/web/lists/getbytitle('${libraryName}')/MaillingMe/${docname}/add`;

//         // Get the form digest value
//         const digest = await getFormDigest(siteUrl);

//         // Set headers for the request
//         const headers = new Headers({
//             Accept: "application/json;odata=verbose",
//             "X-RequestDigest": digest,
//         });

//         // Perform the file upload
//         const uploadResult = await fetch(endpointUrl, {
//             method: "POST",
//             headers: headers,
//             body: fileBlob,
//         });

//         if (uploadResult.ok) {
//             console.log("File uploaded successfully!");
//         } else {
//             console.error("Error uploading file:", uploadResult.statusText);
//         }
//     } else {
//         console.error("No file selected.");
//     }
// }






function getdoctype(successCallback, errorCallback) {
    if (formContext.getAttribute("arq_doctype").getValue() !== null) {
        var doctype = formContext.getAttribute("arq_doctype").getValue()[0].id.slice(1, -1);

        Xrm.WebApi.retrieveRecord("arq_documenttype", doctype, "?$select=arq_documentclassification").then(
            function success(result) {
                doc = result.arq_documentclassification;
                successCallback(); // Call the success callback function
            },
            function (error) {
                console.log("ERROR => " + error.message);
                errorCallback(error); // Call the error callback function
            }
        );
    } else {
        errorCallback("No document type selected");
    }
}