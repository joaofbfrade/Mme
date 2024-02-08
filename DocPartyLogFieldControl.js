var isFrom = false;
var isTo = false;

//
function FieldControl(primaryControl) {
    "use strict";

    var formContext = primaryControl.getFormContext();

    formContext.getControl("arq_relatedentity").setVisible(false);
    formContext.getControl("arq_entityinformation").setVisible(false);
    formContext.getControl("arq_relatedemail").setVisible(false);
    formContext.getControl("arq_mainphone").setVisible(false);
    formContext.getControl("arq_addressmainline").setVisible(false);
    formContext.getControl("arq_postalcode").setVisible(false);
    formContext.getControl("arq_relateduser").setVisible(false);


    if (formContext.getAttribute("arq_document").getValue() !== null) {

        var doc = formContext.getAttribute("arq_document").getValue()[0].id.slice(1, -1);
        console.log("documentlogID => " + doc);

        Xrm.WebApi.retrieveRecord("arq_documentlog", doc, "?$select=_arq_docfromparty_value,_arq_doctoparty_value,_arq_doctype_value").then(
            function success(result) {


                var guid = formContext.data.entity.getId().slice(1, -1);


                console.log(result._arq_docfromparty_value);
                console.log(guid);

                if (result._arq_docfromparty_value.toUpperCase() === guid.toUpperCase()) {
                    isFrom = true;
                    console.log("isfrom");
                }

                if (result._arq_doctoparty_value.toUpperCase() === guid.toUpperCase()) {
                    isTo = true;
                    console.log("isTo");
                }


                getdoctype(result._arq_doctype_value, formContext);


            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );

    }



    formContext.getAttribute("arq_relatedentity").addOnChange(FillFields);
    formContext.getAttribute("arq_entityinformation").addOnChange(SetField);






    // formContext.getAttribute("arq_event").setValue(false);
    // formContext.getControl("Subgrid_new_2").setVisible(false);







}


function getdoctype(doctypeid, formContext) {

    console.log("getdoctype");
    Xrm.WebApi.retrieveRecord("arq_documenttype", doctypeid, "?$select=arq_documentclassification").then(
        function success(result) {
            var doctype = result.arq_documentclassification;

            console.log("doctype => " + doctype)




            // internal
            //quando é interno apresenta apenas o qvf interno dos 2 lados
            if (doctype === 1) {

                formContext.getControl("arq_relateduser").setVisible(true);

                // inbound
                // quando é externo entrada, apresenta o qvf externo da esq e o qvf interno na dir


            } else if (doctype === 2 && isFrom) {
                formContext.getControl("arq_relatedentity").setVisible(true);
                formContext.getControl("arq_entityinformation").setVisible(true);
                formContext.getControl("arq_relatedemail").setVisible(true);
                formContext.getControl("arq_mainphone").setVisible(true);
                formContext.getControl("arq_addressmainline").setVisible(true);
                formContext.getControl("arq_postalcode").setVisible(true);




            } else if (doctype === 2 && isTo) {


                formContext.getControl("arq_relateduser").setVisible(true);





            } else if (doctype === 3 && isFrom) {

                formContext.getControl("arq_relateduser").setVisible(true);




            } else if (doctype === 3 && isTo) {

                formContext.getControl("arq_relatedentity").setVisible(true);
                formContext.getControl("arq_entityinformation").setVisible(true);
                formContext.getControl("arq_relatedemail").setVisible(true);
                formContext.getControl("arq_mainphone").setVisible(true);
                formContext.getControl("arq_addressmainline").setVisible(true);
                formContext.getControl("arq_postalcode").setVisible(true);


            }


        },
        function (error) {
            console.log("ERROR => " + error.message);
            // handle error conditions
        }
    );
}


function FillFields(executionContext) {

    var formContext = executionContext.getFormContext();
    console.log("changed");


    console.log(id);


    if (formContext.getAttribute("arq_relatedentity").getValue() != null) {

        var id = formContext.getAttribute("arq_relatedentity").getValue()[0].id.slice(1, -1);

        formContext.getAttribute("arq_entityinformation").setValue(true);
        Xrm.WebApi.retrieveRecord("account", id, "?$select=address1_line1,address1_postalcode,emailaddress1,telephone1").then(
            function success(result) {
                formContext.getAttribute("arq_relatedemail").setValue(result.emailaddress1);
                formContext.getAttribute("arq_mainphone").setValue(result.telephone1);
                formContext.getAttribute("arq_addressmainline").setValue(result.address1_line1);
                formContext.getAttribute("arq_postalcode").setValue(result.address1_postalcode);


            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }



        );

        


    } else {
        formContext.getAttribute("arq_entityinformation").setValue(false);

        formContext.getAttribute("arq_relatedemail").setValue(null);
        formContext.getAttribute("arq_mainphone").setValue(null);
        formContext.getAttribute("arq_addressmainline").setValue(null);
        formContext.getAttribute("arq_postalcode").setValue(null);

    
    }




}


function SetField(executionContext){
    var formContext= executionContext.getFormContext();

    if (formContext.getAttribute("arq_entityinformation").getValue() === false) {

        formContext.getAttribute("arq_relatedemail").setValue(null);
        formContext.getAttribute("arq_mainphone").setValue(null);
        formContext.getAttribute("arq_addressmainline").setValue(null);
        formContext.getAttribute("arq_postalcode").setValue(null);


    } else{
        FillFields(executionContext);
    }

}