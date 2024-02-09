const siteUrl = "https://your-sharepoint-site-url";
const libraryName = "Documents";
const file = "";
const flowUrl = 'https://prod-49.westeurope.logic.azure.com:443/workflows/8041cdd51555442aa5762044f624f445/triggers/manual/paths/invoke?api-version=2016-06-01';





function openPage(executionContext) {

    formContext = executionContext.getFormContext();
    
    var doctype = formContext.getAttribute("arq_doctype").getValue();
    var name = formContext.getAttribute("arq_name").getValue();
    //var doctype = formContext.getAttribute().getValue();
    //var doctype = formContext.getAttribute().getValue();
    

    Xrm.Device.pickFile().then(

        function (data) {

            // attach the uploaded file as attachment to note
            var entity = {};
            //entity.subject = "Sample Subject";
            entity.documentbody = data[0].fileContent;
            entity.filename = data[0].fileName;
            entity.mimetype = data[0].mimeType;
            //entity.notetext = "Sample Text";

            var appendstring = `{
                "name": "${name}",            
                "signature": "${signature}",
                "details": '${details}',
                "nextsteps": '${nextsteps}',
                "owner": '${owner}',
                "Createdon": '${CreatedOn}',
                "customer": "${customer}",
                "id":"${id}"
    
              }`;

            // lead entity sample
            // entity["objectid_lead@odata.bind"] = "/leads(" + entityId + ")";
            console.log(entity.documentbody);
            file = entity.documentbody;

            var pageInput = {
                pageType: "custom",
                name: "arq_uploadpage_b2417",
            };
            var navigationOptions = {
                target: 2,
                position: 1,
                width: { value: 50, unit: "%" },
                height: 500,
                title: "Your File is being Uploaded"
            };
            Xrm.Navigation.navigateTo(pageInput, navigationOptions)
                .then(
                    function () {
                        var req = new XMLHttpRequest();
                        req.timeout = 1200000;
                        req.open("POST", flowUrl, true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 200) {

                                    Sendfile();




                                }
                                else {
                                    formContext.ui.setFormNotification("An error occured generating your documents!", "ERROR", infoId);
                                }
                            }
                        };
                        req.send(appendstring);
                    }
                ).catch(
                    function (error) {
                        // Handle error
                    }
                );


        },
        function (error) {
            Xrm.Utility.alertDialog("Error occured while picking file. Please try again");
        }
    );
}






async function uploadFile() {
    if (file) {
        // Convert base64-encoded file content to binary data
        const binaryData = atob(file);
        const fileByteArray = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
            fileByteArray[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from binary data
        const fileBlob = new Blob([fileByteArray]);

        // SharePoint REST API endpoint
        const endpointUrl = `${siteUrl}/_api/web/lists/getbytitle('${libraryName}')/MaillingMe/${doctype}/add(url='your-filename.txt',overwrite=true)`;

        // Get the form digest value
        const digest = await getFormDigest(siteUrl);

        // Set headers for the request
        const headers = new Headers({
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": digest,
        });

        // Perform the file upload
        const uploadResult = await fetch(endpointUrl, {
            method: "POST",
            headers: headers,
            body: fileBlob,
        });

        if (uploadResult.ok) {
            console.log("File uploaded successfully!");
        } else {
            console.error("Error uploading file:", uploadResult.statusText);
        }
    } else {
        console.error("No file selected.");
    }
}






