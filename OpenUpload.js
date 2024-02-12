const siteUrl = "https://arquiconsult1.sharepoint.com/teams/PowerPlatformSandbox";
const libraryName = "Documents";
var file = "";
const flowUrl = 'https://prod-49.westeurope.logic.azure.com:443/workflows/8041cdd51555442aa5762044f624f445/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dA7b8B3JAm97_Qef-3cq-NZBWMvcK5830kzt3hnP8Kk';
var doctype;
var docname;
var file;


function openPage(executionContext) {

    formContext = executionContext;
    doctype = formContext.getAttribute("arq_doctype").getValue();
    docname = formContext.getAttribute("arq_name").getValue();
    //var doctype = formContext.getAttribute().getValue();
    //var doctype = formContext.getAttribute().getValue();
    id = formContext.data.entity.getId().slice(1, -1);

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

            

            console.log("navigate");
            xmlrequest();

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
    var navigationOptions = {
        target: 2,
        position: 1,
        width: { value: 50, unit: "%" },
        height: 500,
        title: "Your File is being Uploaded"
    };

    var appendstring = `{
        "name": "${docname}",  
        "doctype": "${doctype}"      
        "Id":"${id}"

      }`;
    

    Xrm.Navigation.navigateTo(pageInput, navigationOptions)
        .then(
            function(){
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
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {

                console.log("before send");
                uploadFile();

                // entity["objectid_lead@odata.bind"] = "/leads(" + entityId + ")";



            }
            else {
                formContext.ui.setFormNotification("An error occured generating your documents!", "ERROR", infoId);
            }
        }
    };
    req.send(appendstring);
}


async function uploadFile() {

    console.log("upload file");
    if (file) {

        console.log("");
        // Convert base64-encoded file content to binary data
        const binaryData = atob(file);
        const fileByteArray = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
            fileByteArray[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from binary data
        const fileBlob = new Blob([fileByteArray]);

        // SharePoint REST API endpoint
        const endpointUrl = `${siteUrl}/_api/web/lists/getbytitle('${libraryName}')/MaillingMe/${docname}/add`;

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






