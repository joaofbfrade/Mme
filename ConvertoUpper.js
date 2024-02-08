if (typeof Arq === "undefined") {
    Arq = {
        __namespace: true,
    };
}

Arq.Account = {
    _formContext: null,

    onFormLoad: function (e) {
        "use strict";
        debugger;
        var self = Arq.Account;
        self._formContext = e.getFormContext();
        var formType = self._formContext.ui.getFormType();
        // switch (formType) {
        // 	case 1:
        // 		break;
        // 	case 2:
        // 		break;
        // 	case 4:
        // 		break;
        // }


        self.allsupper();
    },



    allsupper: function () {

        "use strict";
        var self = Arq.Account;

        self._addOnChangeToAttr("arq_code", function () {
            var arqCodeValue = self._getAttrVal("arq_code");
            var upperCaseValue = self.toUpperAutomatic(arqCodeValue);
            self._setAttrValue("arq_code", upperCaseValue);
        });

        self._addOnChangeToAttr("arq_description", function () {
            var arqCodeValue = self._getAttrVal("arq_description");
            var upperCaseValue = self.toUpperAutomatic(arqCodeValue);
            self._setAttrValue("arq_description", upperCaseValue);
        });
    },

    toUpperAutomatic: function (arq_code) {
        "use strict";

        var result = arq_code.toUpperCase();
        return result;
    },





    onFormSave: function (e) {
        "use strict";
        var self = Arq.Account;
        self._formContext = e.getFormContext();
        // var formType = self._formContext.ui.getFormType();
        // switch (formType) {
        // 	case 1:
        // 		break;
        // 	case 2:
        // 		break;
        // 	case 4:
        // 		break;
        // }
    },


    //  





    _saveAndRefresh: function () {
        Xrm.Page.data.refresh(true);
    },

    _setLookup: async function (logicalName, id) {
        "use strict";
        var lookupValue = null;
        if (id != null) {
            var awaitVar = await Xrm.WebApi.retrieveRecord(logicalName, id, "?$select=arq_name").then(
                function success(result) {
                    result.name
                    lookupValue = new Array();
                    lookupValue[0] = new Object();
                    lookupValue[0].id = id;
                    lookupValue[0].name = result.arq_name;
                    lookupValue[0].entityType = logicalName;
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
        }

        return lookupValue;
    },

    _getAttrVal: function (attrName) {
        "use strict";
        var val = null;
        var attr = Arq.Account._formContext.getAttribute(attrName);

        if (attr !== null) val = attr.getValue();

        return val;
    },

    _getChildsCount: async function (id) {
        "use strict";
        var val = 0
        var awaitVar = await Xrm.WebApi.retrieveMultipleRecords("arq_occurrencetype", "?$filter=(_arq_parentoccurrencetype_value eq '" + id + "')").then(
            function success(result) {
                val = result.entities.length;
            },
            function (error) {
                console.log("Error!");
            }
        );

        return val;
    },

    _ApiRetrieveRecord: async function (sEntityName, sRecordId, sColumns, sExpand) {
        "use strict";
        var odataSelect = "?";
        if (sColumns) {
            odataSelect += "$select=" + sColumns;
        }
        if (sExpand) {
            sExpand += "&$expand=" + sExpand;
        }

        return new Promise((resolve) => {
            {
                resolve(
                    Xrm.WebApi.retrieveRecord(sEntityName, sRecordId, odataSelect).then(
                        function success(result) {
                            return result;
                        },
                        function (error) {
                            Xrm.Navigation.openAlertDialog(error.message);
                        }
                    )
                );
            }
        });
    },

    _getLookupId: function (attrName) {
        "use strict";
        var id = null;
        var attr = Arq.Account._formContext.getAttribute(attrName);
        var lookUpValue = attr.getValue();
        if (attr !== null) {
            if (!(lookUpValue === null || lookUpValue.length === 0)) {
                id = lookUpValue[0].id;
                id = id.substr(1, id.length - 2);
            }
        }
        return id;
    },

    _setAttrValue: function (attrName, val, fireOnChange) {
        "use strict";
        if (typeof fireOnChange === "undefined") fireOnChange = true;

        var attr = Arq.Account._formContext.getAttribute(attrName);
        if (attr !== null) {
            attr.setValue(val);
            if (fireOnChange) attr.fireOnChange();
        }
    },


    _ApiRetrieveMultiple: async function (sEntityName, sSelect, sExpand, sFilter) {
        'use strict';
        var odataSelect = "";
        if (sSelect) {
            odataSelect += "?$select=" + sSelect;
        }
        if (sExpand) {
            odataSelect += "&$expand=" + sExpand;
        }
        if (sFilter) {
            odataSelect += "&$filter=" + sFilter;
        }
        return new Promise(resolve => {
            resolve(
                Xrm.WebApi.retrieveMultipleRecords(sEntityName, odataSelect).then(
                    function success(result) {
                        return result;
                    },
                    function (error) {
                        Xrm.Navigation.openAlertDialog(error.message);
                    }
                )
            )
        })
    },

    _addOnChangeToAttr: function (attrName, func) {
        'use strict';
        var attr = Arq.Account._formContext.getAttribute(attrName);
        if (attr !== null) {
            attr.addOnChange(func);
        }
    }





}
