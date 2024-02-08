function openform() {
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "arq_documentlog";
    entityFormOptions["useQuickCreateForm"] = true;

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
            // Verificar se o registro foi criado com sucesso
            if (success && success.savedEntityReference) {
                var entityId = success.savedEntityReference[0].id;
                var entityName = success.savedEntityReference[0].entityType;

                // Redirecionar o usuário para o registro recém-criado
                Xrm.Navigation.openForm({
                    entityId: entityId,
                    entityName: entityName,
                    openInNewWindow: false  // Defina como true se desejar abrir em uma nova janela
                }).then(
                    function (success) {
                        console.log(success);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            } else {
                console.log("Falha ao criar o registro.");
            }
        },
        function (error) {
            console.log(error);
        }
    );
}
