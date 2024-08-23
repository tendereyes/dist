_spBodyOnLoadFunctions.push(function()
{
    var orderFieldInternalName = "Project"; // Internal name of the lookup field
    var orderFieldValue = GetUrlKeyValue("ProjectID"); // ID of the master item
    if (orderFieldValue == ""){
        orderFieldValue = GetUrlKeyValue("ContractID"); // ID of the master item
        if (orderFieldValue != ""){
            orderFieldInternalName = "Contract"; // Internal name of the lookup field
        }else{
            orderFieldValue = GetUrlKeyValue("CompetitorID"); // ID of the master item
            if (orderFieldValue != ""){
                orderFieldInternalName = "Competitor"; // Internal name of the lookup field
                if (GetUrlKeyValue("fieldName") == "Company"){
                    orderFieldInternalName = "Company"
                }
            }else{
                orderFieldValue = GetUrlKeyValue("SubconID"); // ID of the master item
                if (orderFieldValue != ""){
                    orderFieldInternalName = "Subcontractor"; // Internal name of the lookup field
                }
            }
        }
    }
    if (orderFieldValue != ""){    
        try{
        $('[id$="ListTitleViewSelectorMenu_Container"]').css("display","none")
        $('#Ribbon.List.CustomViews-LargeMedium-2').css("display","none")

        SP.SOD.executeFunc('clienttemplates.js', 'SPClientTemplates.TemplateManager.RegisterTemplateOverrides', function() {

        SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
            OnPostRender: function(ctx) {
                if (orderFieldValue != ""){
                var viewId = '';
                if (window.location.hash != ""){
                    var equ = window.location.hash.indexOf("=")
                    var hash = window.location.hash
                    if (equ != -1){
                        hash = hash.substring(0,equ)
                    }
                    viewId = "{"+hash.replace("#InplviewHash","")+"}"
                }
                viewId = viewId.toUpperCase()
                var done = false;
                $('[id$="ListTitleViewSelectorMenu_Container"]').css("display","none")
               if (ctx.view.toLowerCase() != viewId.toLowerCase() || ctx.enteringGridMode || !ctx.inGridMode || done)
                  return;
        
                // Fetch JSGrid object
                var jsGridContainer = $get("spgridcontainer_" + g_SPGridInitInfo[viewId].jsInitObj.qualifier)
                var jsGrid = jsGridContainer.jsgrid;
                // Automatically update master lookup column
                var lock = 0;
                jsGrid.AttachEvent(SP.JsGrid.EventType.OnEntryRecordPropertyChanged, function(args) {
                    if (lock == 0) {
                        lock = 1;
                        var update = SP.JsGrid.CreateUnvalidatedPropertyUpdate(args.recordKey,orderFieldInternalName,orderFieldValue,false);
                        jsGrid.UpdateProperties([update], SP.JsGrid.UserAction.UserEdit);
                        lock = 0;
                    }
                });
              
                done = true;
            }
            }
        });
        
    });
        }
        catch(err) {
            
        }
}
});
