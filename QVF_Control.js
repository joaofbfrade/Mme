function FieldControl(primaryControl) {
    "use strict";
    
    var formContext = primaryControl.getFormContext();



    if (formContext.getAttribute("arq_doctype").getValue() !== null) {

        var doctype = formContext.getAttribute("arq_doctype").getValue()[0].id.slice(1, -1);

        // Xrm.WebApi.retrieveRecord("arq_documenttype", doctype, "?$select=arq_documentclassification").then(
        //     function success(result) {
        //         var doctype = result.arq_documentclassification;



        //         var QVF_FROM_USER = formContext.ui.quickForms.get("QVF_FROM_USER");
        //         var QVF_FROM_ENTITY = formContext.ui.quickForms.get("QVF_FROM_ENTITY");
        //         var QVF_TO_USER = formContext.ui.quickForms.get("QVF_TO_USER");
        //         var QVF_TO_ENTITY = formContext.ui.quickForms.get("QVF_TO_ENTITY");


        //         if(QVF_FROM_USER)  QVF_FROM_USER.setVisible(false);               
        //         if(QVF_TO_USER)QVF_TO_USER.setVisible(false);
        //         if(QVF_FROM_ENTITY)QVF_FROM_ENTITY.setVisible(false);
        //         if(QVF_TO_ENTITY)QVF_TO_ENTITY.setVisible(false);



        //         // internal
        //         //quando é interno apresenta apenas o qvf interno dos 2 lados
        //         if (doctype === 1) {

        //             console.log("DOC TYPE 1");

        //             QVF_FROM_USER.setVisible(true);
        //             QVF_TO_USER.setVisible(true);

        //             QVF_FROM_ENTITY.setVisible(false);
        //             QVF_TO_ENTITY.setVisible(false);

        //             // inbound
        //             // quando é externo entrada, apresenta o qvf externo da esq e o qvf interno na dir
        //         } else if (doctype === 2) {

        //             console.log("DOC TYPE 2");


        //             QVF_FROM_ENTITY.setVisible(true);
        //             QVF_TO_USER.setVisible(true);

        //             QVF_TO_ENTITY.setVisible(false);
        //             QVF_FROM_USER.setVisible(false);


        //             // outbound~
        //             // quando é externo saida, apresenta o qvf interno da esq e o qvf externo na dir
        //         } else if (doctype === 3) {

        //             console.log("DOC TYPE 3");

        //             QVF_FROM_USER.setVisible(true);
        //             QVF_TO_ENTITY.setVisible(true);

        //             QVF_FROM_ENTITY.setVisible(false);
        //             QVF_TO_USER.setVisible(false);


        //         }
        //     },
        //     function (error) {
        //         console.log("ERROR => " + error.message);
        //         // handle error conditions
        //     }
        // );

    }



    // formContext.getAttribute("arq_event").setValue(false);
    // formContext.getControl("Subgrid_new_2").setVisible(false);







}
