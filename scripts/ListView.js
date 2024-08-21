var listView = []
var itemId = -1
var runDatatableOnce = 1
var table
var statusChoices = []
var maxTableWidth = 0
var dataTableId = -1
var globalList = ""
var globalView = ""
var globalListName = ''
var globalSPURL = ""
var buildSelect = 1

function displayList(tableId, List, View, mTableWidth, AdditionalFilter) {
    maxTableWidth = mTableWidth
    dataTableId = tableId
    globalList = List
    globalView = View
    sprLib.rest({
            url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('" + List + "')/Fields"
        })
        .then(function(arrayResults) {
            GetView(View, arrayResults, tableId, List, AdditionalFilter)
        })
}

function GetView(viewName, arrayResults, tableId, List, AdditionalFilter) {
    sprLib.rest({
            url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('" + List + "')/Views",
            type: "GET",
            headers: { "accept": "application/json; odata=verbose" }
        })
        .then(function(arrItems) {
            var viewURL = ""
            var viewXml = ""
            var orderBy = ""
            var filterby = ""
            arrItems.forEach(function(obj, idx) {
                listView.push({ title: obj.Title, id: obj.Title })
                if (obj.Title == viewName) {
                    globalSPURL = obj.ServerRelativeUrl
                    var linkfilter = ""
                    if ($('#listHeaderLink').attr("filter")) {
                        linkfilter = $('#listHeaderLink').attr("filter")
                    }
                    var linkToSP = "<a style='color: #3f6ad8;' href='" + obj.ServerRelativeUrl + linkfilter + "' target='_blank'>" + $('#listHeaderLink').html() + "</a>"
                    $('#listHeaderLink').html(linkToSP)
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(obj.ListViewXml, "text/xml");
                    var viewCols = []
                    for (h = 0; h < xmlDoc.getElementsByTagName("ViewFields")[0].childNodes.length; h++) {
                        viewCols.push(xmlDoc.getElementsByTagName("ViewFields")[0].childNodes[h].getAttribute("Name"))
                    }
                    //if (obj.DefaultView){
                    viewXml = obj.ViewQuery
                    viewURL = obj.ViewFields.__deferred.uri
                    globalListName = obj.ServerRelativeUrl.split('/')[4]
                    var xmlDoc = $.parseXML("<Query>" + viewXml + "</Query>")
                    $xml = $(xmlDoc)

                    $xml.find("OrderBy").children("FieldRef ").each(function(obj, child) {
                        if (orderBy != "") {
                            orderBy += ", "
                        }
                        orderBy += child.attributes[0].value
                        if (child.attributes.length > 1) {
                            if (child.attributes[1].value == "FALSE" && child.attributes[1].name == "Ascending") {
                                orderBy += " desc"
                            }
                        }
                    });
                    $xml.find("Where").each(function(obj, child) {
                        filterby = readChild(child, "")
                    });

                    if (AdditionalFilter != "") {
                        if (filterby == "") {
                            filterby = "(" + AdditionalFilter + ")"
                        } else {
                            filterby = "(" + filterby + " and (" + AdditionalFilter + "))"
                        }
                    }
                    displayTable(viewURL, arrayResults, filterby, orderBy, tableId, List, viewCols)
                }
            });
            if (buildSelect == 1) {
                for (var c = 0; c < listView.length; c++) {
                    $('#selectView1').append($('<option>', {
                        value: listView[c].id,
                        text: listView[c].title
                    }));
                }
            }
            buildSelect++

            $("#selectView1").val(viewName)
            $("#selectView1").change(function() {
                GetView($("#selectView1 option:selected").text(), arrayResults, tableId, List, AdditionalFilter)
            });
        })

}

function displayTable(viewURL, arrayResults, filterBy, orderBy, tableId, List, viewCols) {
    // if ( $.fn.DataTable.isDataTable('#listTableData') ) {
    //         $('#listTableData').DataTable('destroy');
    // }
    var colWidth = []
    var colLength = []
    $('#' + tableId + ' tbody').html("")
    $('#' + tableId + ' thead').html("")
    var columns = []
    var itemType = []
    var allFields = []
    var dependantNames = ""
    arrayResults.forEach(function(obj, idx) {
        var depN = ""
        var lField = ""
        if (obj.TypeAsString.indexOf("Lookup") != -1) {
            lField = obj.LookupField
            if (obj.DependentLookupInternalNames) {
                for (g = 0; g < obj.DependentLookupInternalNames.results.length; g++) {
                    depN += depN == "" ? obj.DependentLookupInternalNames.results[g] : ";" + obj.DependentLookupInternalNames.results[g]
                }
                allFields.push({ dependantNames: depN, LookupField: lField, internalName: obj.InternalName })
            }
        }
    });
    columns.push("Id")
    itemType.push({ type: 'Id', format: "-1", colTitle: "ID" })
    for (h = 0; h < viewCols.length; h++) {
        var columnName = viewCols[h]
        var type = ""
        var format = ""
        var colTitle = ""
        dependantNames = ""
        var LookupField = ""
        var internalName = ""
        var obj = arrayResults.filter(function(fieldRec) {
            return fieldRec.InternalName === columnName;
        })[0];
        //arrayResults.forEach(function(obj, idx) {
        if (columnName == obj.InternalName) {
            internalName = obj.InternalName
            if (obj.DependentLookupInternalNames) {
                for (g = 0; g < obj.DependentLookupInternalNames.results.length; g++) {
                    dependantNames += dependantNames == "" ? obj.DependentLookupInternalNames.results[g] : ";" + obj.DependentLookupInternalNames.results[g]
                }
            }
            type = obj.TypeAsString
            if (type == "Calculated") {
                if (obj.InternalName == "Checkmark") {
                    type = "Boolean"
                }
            }
            if (obj.DisplayFormat) {
                format = obj.DisplayFormat
            } else {
                format = ""
            }
            colTitle = obj.Title
            if (obj.TypeAsString.indexOf("Choice") != -1) {
                statusChoices = obj.Choices.results
            }
            if (obj.TypeAsString.indexOf("User") != -1) {
                if (obj.InternalName.indexOf("_x003a_") == -1) {
                    columnName = columnName + "/Title"
                } else {
                    var fieldName = obj.InternalName.split("_x003a_")
                    if (fieldName.length > 1) {
                        columnName = fieldName[0] + "/Title"
                    }
                }
            }
            if (obj.TypeAsString.indexOf("Lookup") != -1) {
                LookupField = obj.LookupField
                if (obj.InternalName.indexOf("_x003a_") == -1) {
                    columnName = columnName + "/" + obj.LookupField
                } else {
                    var fieldName = obj.InternalName.split("_x003a_")
                    if (fieldName.length > 1) {
                        columnName = fieldName[0] + "/" + fieldName[1]
                    }
                }
            }
        }
        //});
        if (columnName != "Edit" && columnName != "_Comments" && columnName != "_ModerationStatus" && columnName != "ID" && columnName != "_UIVersionString" && columnName.indexOf("CheckinComment") == -1 && columnName != "ItemChildCount/ItemChildCount" && colTitle.indexOf(":") == -1) {
            itemType.push({ type: type, format: format, colTitle: colTitle, dependantNames: dependantNames, LookupField: LookupField, internalName: internalName })
            columns.push(columnName)
        }
    }
    for (d = 0; d < columns.length; d++) {
        if (itemType[d].type == "Lookup") {
            for (e = 0; e < allFields.length; e++) {
                if (allFields[e].dependantNames) {
                    if (allFields[e].dependantNames.indexOf(itemType[d].internalName) != -1) {
                        columns[d] = allFields[e].internalName + "/" + itemType[d].LookupField
                    }
                }
            }
        }
    }
    sprLib.list({ name: List, baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" }).items({
            listCols: columns,
            queryFilter: filterBy,
            queryOrderby: orderBy,
            queryLimit: 5000
        })
        .then(function(arrItems) {
            var viewURL = ""
            var tableHeader = "<tr>"
            tableHeader += "<th class='editCol'>Edit</th>"
            colWidth.push({ "width": '30px', "targets": 0 })
            colLength.push({ "width": '30px', "targets": 0 })
            for (var b = 0; b < columns.length; b++) {
                var colClass = "big-col"
                var recNo = b + 1
                switch (itemType[b].type) {
                    case 'Id':
                        colClass = 'IdCol'
                        colWidth.push({ "width": '10px', "targets": (b + 1) })
                        colLength.push({ "width": '10px', "targets": recNo })
                        break;
                    case 'DateTime':
                        colClass = 'dataCol'
                        colWidth.push({ "width": '150px', "targets": (b + 1) })
                        colLength.push({ "width": '150px', "targets": recNo })
                        break;
                    case 'Counter':
                        colClass = 'counterCol'
                        colWidth.push({ "width": '50px', "targets": (b + 1) })
                        colLength.push({ "width": '50px', "targets": recNo })
                        break;
                    case 'number':
                        colClass = 'numCol'
                        colWidth.push({ "width": '80px', "targets": (b + 1) })
                        colLength.push({ "width": '80px', "targets": recNo })
                        break;
                    case 'Number':
                        colClass = 'numCol'
                        colLength.push({ "width": '80px', "targets": recNo })
                        colWidth.push({ "width": '80px', "targets": (b + 1) })
                        break;
                    case 'Currency':
                        colClass = 'numCol'
                        colLength.push({ "width": '80px', "targets": recNo })
                        colWidth.push({ "width": '80px', "targets": (b + 1) })
                        break;
                    case 'Calculated':
                        colClass = 'numCol'
                        colLength.push({ "width": '80px', "targets": recNo })
                        colWidth.push({ "width": '80px', "targets": (b + 1) })
                        break;
                    case 'UserMulti':
                        colClass = 'userMCol'
                        colLength.push({ "width": '150px', "targets": recNo })
                        colWidth.push({ "width": '150px', "targets": (b + 1) })
                        break;
                    case "Choice":
                        colClass = 'choiceCol'
                        colLength.push({ "width": '150px', "targets": recNo })
                        colWidth.push({ "width": '150px', "targets": (b + 1) })
                        break;
                    case "Lookup":
                        colClass = 'lookupCol'
                        colLength.push({ "width": '150px', "targets": recNo })
                        colWidth.push({ "width": '150px', "targets": (b + 1) })
                        break;
                    case "Boolean":
                        colClass = 'booleanCol'
                        colLength.push({ "width": '100px', "targets": recNo })
                        colWidth.push({ "width": '100px', "targets": (b + 1) })
                        break;
                    case "Text":
                        colClass = 'textCol'
                        colLength.push({ "width": '200px', "targets": recNo })
                        colWidth.push({ "width": '200px', "targets": (b + 1) })
                        break;
                    case "Attachments":
                        colClass = 'attachCol'
                        colLength.push({ "width": '20px', "targets": recNo })
                        colWidth.push({ "width": '20px', "targets": (b + 1) })
                        break;
                    default:
                        colClass = 'big-col'
                        colLength.push({ "width": '400px', "targets": recNo })
                        colWidth.push({ "width": '400px', "targets": (b + 1) })
                        break;

                }

                // if(columns[b].indexOf('/Title')){
                //    tableHeader += "<th class='"+colClass+"'>"+columns[b].split('/')[0].split(/(?=[A-Z])/).join(" ").replace(/_x0020_/g," ")+"</th>"
                // }else {  
                //<i class = 'fas fa-paperclip'></i>

                if (itemType[b].type == "Attachments") {
                    tableHeader += "<th class='" + colClass + "'><i class = 'fas fa-paperclip'></i></th>"
                } else {
                    tableHeader += "<th class='" + colClass + "'>" + itemType[b].colTitle + "</th>"
                }
                //}
            }
            tableHeader += "</tr>"
            $('#' + tableId + ' thead').html(tableHeader)
            arrItems.forEach(function(obj, idx) {
                var tableRow = "<tr class='context-menu-one' itemId = '" + obj['Id'] + "'>"
                tableRow += "<td><a href='javascript:openItem(&#34;" + globalListName + "&#34;," + obj['Id'] + ")'><i class='fas fa-edit'></i></a></td>"
                for (var a = 0; a < columns.length; a++) {
                    var lookupVal = "&nbsp;"
                    if (itemType[a].type.indexOf('User') != -1) {
                        if (obj[columns[a].split('/Title')[0]]) {
                            if ($.isArray(obj[columns[a].split('/')[0]])) {
                                var columnVal = obj[columns[a].split('/')[0]]
                                columnVal.forEach(function(columnVal, idx) {
                                    lookupVal = lookupVal == "&nbsp;" ? columnVal.Title : lookupVal + "; " + columnVal.Title
                                })
                            } else {
                                lookupVal = obj[columns[a].split('/')[0]].Title ? obj[columns[a].split('/')[0]].Title : "&nbsp;";
                            }
                        }
                        tableRow += "<td>" + lookupVal + "</td>"
                    } else if (itemType[a].type.indexOf('Lookup') != -1) {
                        var lookupVal = "&nbsp;"
                        if (obj[columns[a].split('/')[0]]) {
                            if ($.isArray(obj[columns[a].split('/')[0]])) {
                                var columnVal = obj[columns[a].split('/')[0]]
                                columnVal.forEach(function(columnVal, idx) {
                                    var tmpObj = columnVal
                                    var colID = 0
                                    for (s = 0; s < Object.keys(tmpObj).length; s++) {
                                        if (Object.keys(tmpObj)[s] == columns[a].split('/')[1]) {
                                            colID = s
                                        }
                                    }
                                    lookupVal = lookupVal == "&nbsp;" ? tmpObj[Object.keys(tmpObj)[colID]] : lookupVal + "; " + tmpObj[Object.keys(tmpObj)[colID]]
                                })
                            } else {
                                var tmpObj = obj[columns[a].split('/')[0]]
                                var colID = 0
                                for (s = 0; s < Object.keys(tmpObj).length; s++) {
                                    if (Object.keys(tmpObj)[s] == columns[a].split('/')[1]) {
                                        colID = s
                                    }
                                }
                                lookupVal = tmpObj[Object.keys(tmpObj)[colID]] ? tmpObj[Object.keys(tmpObj)[colID]] : "&nbsp;";
                            }
                        }
                        tableRow += "<td>" + lookupVal + "</td>"
                    } else if (itemType[a].type.indexOf('DateTime') != -1) {
                        if (obj[columns[a]]) {
                            if (itemType[a].format == 0) {
                                tableRow += "<td>" + formatDates(obj[columns[a]]) + "</td>"
                            } else {
                                tableRow += "<td>" + formatDates(obj[columns[a]], true) + "</td>"
                            }
                        } else {
                            tableRow += "<td>&nbsp;</td>"

                        }
                    } else if (itemType[a].type.indexOf('Calculated') != -1) {
                        if (obj[columns[a]].indexOf(".") != -1) {
                            tableRow += "<td>" + obj[columns[a]].split(".")[0] + "</td>"
                        } else {
                            tableRow += "<td>" + obj[columns[a]] + "</td>"
                        }
                    } else if (itemType[a].type.indexOf('Number') != -1) {
                        if (obj[columns[a]]) {
                            if (itemType[a].format) {
                                if (itemType[a].format == "-1") {
                                    tableRow += "<td>" + obj[columns[a]] + "</td>"
                                } else {
                                    if ($.isNumeric(itemType[a].format)) {
                                        tableRow += "<td>" + numberWithCommas(obj[columns[a]], parseInt(itemType[a].format)) + "</td>"
                                    } else {
                                        tableRow += "<td>" + numberWithCommas(obj[columns[a]], 0) + "</td>"
                                    }
                                }
                            } else {
                                tableRow += "<td>" + numberWithCommas(obj[columns[a]], 0) + "</td>"
                            }
                        } else {
                            tableRow += "<td>&nbsp;</td>"
                        }

                    } else if (itemType[a].type.indexOf('Boolean') != -1 || itemType[a].type.indexOf('AllDayEvent') != -1 || itemType[a].type.indexOf('Recurrence') != -1) {
                        if (obj[columns[a]]) {
                            if (obj[columns[a]] == 0 || obj[columns[a]] == false) {
                                tableRow += "<td>No</td>"
                            } else {
                                tableRow += "<td>Yes</td>"
                            }
                        } else {
                            tableRow += "<td>No</td>"
                        }
                    } else if (itemType[a].type.indexOf('URL') != -1) {
                        if (obj[columns[a]]) {
                            tableRow += "<td><a href='" + obj[columns[a]].Url + "'>" + obj[columns[a]].Description + "</a></td>"
                        } else {
                            tableRow += "<td>&nbsp;</td>"
                        }
                    } else if (itemType[a].type.indexOf('Attachment') != -1) {
                        if (obj[columns[a]]) {
                            tableRow += "<td><i class='far fa-paperclip'></i></td>"
                        } else {
                            tableRow += "<td>&nbsp;</td>"
                        }
                    } else {
                        if (obj[columns[a]]) {
                            var colVal = obj[columns[a]]
                            if ((List == "Projects" || List == "Contracts" || List == "Competitor Profiles" || List == "Subcontractors") && (columns[a] == "Title" || columns[a] == "LinkTitle")) {
                                var workspaceLink = ""
                                switch (List) {
                                    case "Projects":
                                        workspaceLink = _spPageContextInfo.webServerRelativeUrl + "/SitePages/ProjectInfo.aspx?ProjectID=" + obj["Id"] + "&ProjectTitle=" + escapeProperly(obj[columns[a]])
                                        break;
                                    case "Contracts":
                                        workspaceLink = _spPageContextInfo.webServerRelativeUrl + "/SitePages/ContractInfo.aspx?ContractID=" + obj["Id"] + "&ContractTitle=" + escapeProperly(obj[columns[a]])
                                        break;
                                    case "Subcontractors":
                                        workspaceLink = _spPageContextInfo.webServerRelativeUrl + "/SitePages/SubcontractorInfo.aspx?SubconID=" + obj["Id"] + "&SubconTitle=" + escapeProperly(obj[columns[a]])
                                        break;
                                    case "Competitor Profiles":
                                        workspaceLink = _spPageContextInfo.webServerRelativeUrl + "/SitePages/CompetitorInfo.aspx?CompetitorID=" + obj["Id"] + "&CompetitorTitle=" + escapeProperly(obj[columns[a]])
                                        break;
                                }
                                colVal = "<a href='" + workspaceLink + "' target='_blank'>" + obj[columns[a]] + "</a>"
                            }
                            if (List == "Links" && columns[a] == "URLwMenu") {
                                if (obj[columns[a]].indexOf(",") != -1) {
                                    var fieldVal = obj[columns[a]].split(",")
                                    colVal = "<a href='" + fieldVal[0] + "' target='_blank'>" + fieldVal[1] + "</a>"
                                } else {
                                    colVal = ""
                                }

                            }
                            if (List == "Notices" && columns[a] == "URL") {
                                if (obj[columns[a]] != "") {
                                    colVal = "<a href='" + obj[columns[a]] + "' target='_blank'>" + obj[columns[a]] + "</a>"
                                } else {
                                    colVal = ""
                                }

                            }
                            if (List == "Pictures") {
                                if (columns[a] == "ThumbnailOnForm") {
                                    colVal = '<img galleryimg="false" border="0" class="ms-displayBlock" style="max-width: 128px; max-height: 128px; margin: auto; visibility: visible;" alt="Picture" src="/' + obj[columns[a]] + '" data-themekey="#"></img>'
                                }
                                if (columns[a] == "PreviewOnForm") {
                                    colVal = '<img galleryimg="false" border="0" class="ms-displayBlock" style="max-width: 256px; max-height: 256px; margin: auto; visibility: visible;" alt="Picture" src="' + _spPageContextInfo.webServerRelativeUrl + "/Pictures/" + obj[columns[a]] + '" data-themekey="#"></img>'
                                }
                            }
                            tableRow += "<td>" + colVal + "</td>"
                        } else {
                            tableRow += "<td>&nbsp;</td>"
                        }
                    }
                }
                tableRow += "</tr>"
                $('#' + tableId + ' tbody').append(tableRow)
            });
            // if (runDatatableOnce == 1) {
            $('#loading').html("")
            var workspaceHeight = $('#s4-workspace').height() - 200;
            if ($('#' + tableId + '_length').length == 0) {
                try {
                    if ($.fn.dataTable.isDataTable('#' + tableId)) {
                        table = $('#' + tableId).DataTable();
                    } else {
                        table = $('#' + tableId).DataTable({
                            scrollX: true,
                            scrollY: workspaceHeight + "px",
                            scrollCollapse: true,
                            columnDefs: colWidth,
                            paging: false,
                            initComplete: function() {
                                var headerRow = '<tr id="filterrow" role="row">'
                                var i = 0
                                this.api().columns().every(function() {
                                    i += 1
                                    headerRow += "<td id='filter"+i+"'></td>"
                                });
                                headerRow += '</tr>'
                                $('.dataTable > thead').append(headerRow)
                                var i = 0
                                this.api().columns().every(function() {
                                    i += 1
                                    var column = this;
                                    console.log(column)
                                    var header = $(column.header())
                                    var colWidth = header.css("width")
                                    if (header.text().trim() != "Edit" && header.text().trim() != "" && header.text().trim() != "Workspace" && header.text().trim() != "ID" ) {
                                        var select = $('<select id="col'+i+'" style="width:' + colWidth + '"><option value=""></option></select>')
                                            .appendTo("#filter"+i)
                                            .on('change', function() {
                                                var val = $.fn.dataTable.util.escapeRegex(
                                                    $(this).val()
                                                );
                                                console.log(val)
                                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                                            });
                                        column.data().unique().sort().each(function(d, j) {
                                            if (d.indexOf("href") != -1) {
                                                d = d.split(">")[1]
                                            }
                                            if (d.indexOf("<") != -1) {
                                                d = d.split("<")[0]
                                            }
                                            select.append('<option value="' + d + '">' + d + '</option>')
                                        });
                                    }
                 
                                });

                                $('.filterRow').on('change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );
                                    console.log(val)
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                });
                            }
                        });
                    }
                } catch (err) {}
            }
            $("#" + tableId + " thead tr:not(:first)").hide();
            table.buttons().container().appendTo('#listViewNavBar .col-md-6:eq(0)')
                // $('div.dataTables_wrapper').width(maxTableWidth)
            $('div.dataTables_wrapper').css("max-width", maxTableWidth)
            runDatatableOnce = 2
                // $('#ListTable').find('thead th').css('width', 'auto');
                //   table.columns.adjust().draw();
            $('#' + tableId + ' tbody').on('click', 'tr', function() {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    // $('.selected td:first-child').each(function() {
                    //     itemId = $(this).text()
                    // });
                    $('#editItem a').removeClass('disabled');
                    $('#deleteRow a').removeClass('disabled');
                }
            });
        });
}


function numberWithCommas(num, points) {
    return num.toFixed(points).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


function exportList() {
    $('#' + dataTableId).tableExport({
        type: 'xlsx',
        fileName: globalList + '-' + globalView.replace(/\s/g, '')
    });
}

function deleteItem() {
    if (confirm('Are you sure you want to delete this item?')) {
        var fieldXML = "<Batch OnError='Return' ><Method ID='1' Cmd='Delete'><Field Name='ID'>" + $('tr.selected').attr('itemid') + "</Field></Method></Batch>";
        updateItem(globalList, fieldXML, false, true);
    }
    table.row('.selected').remove().draw(false);
}

function openVersionHistory() {
    var listGUID = GetListId(getParameterByName('List'))
    var url = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/Versions.aspx?list=" + listGUID + "&ID=" + itemId;
    openDialogWithCallBack(url, "Version History");
}

function GetNewItem() {
    newItem(globalListName)
}

function GetListId(listName) {
    var id = "";
    $().SPServices({
        operation: "GetList",
        listName: listName,
        async: false,
        completefunc: function(xData, Status) {
            id = $(xData.responseXML).find("List").attr("ID");
        }
    });
    return id;
}

function onPopUpCloseCallBack(result, returnValue) {
    if (result == SP.UI.DialogResult.OK) {
        displayList(dataTableId, globalList, globalView, maxTableWidth)
    }
}

function openSharePointList() {
    window.open(globalSPURL)
}

function readChild(child, operator) {
    var filter = ""
    var count = 0
    $xml1 = $(child)
    var firstNode = $xml1.find("*").eq(0)[0].nodeName
    if (firstNode == "Or" || firstNode == "And") {
        var orStatement = ""
        $($xml1.find("*").eq(0)[0]).find("*").each(function(obj1, child1) {
            var firstNode1 = $(child1)[0].nodeName
            if (firstNode1 == "Or" || firstNode1 == "And") {
                thisOperator = firstNode1
                count = 0
            }
            var result = buildQuery($(child1), firstNode1)
            if (result != "") {
                count += 1
                if (count >= 2) {
                    thisOperator = firstNode
                }
                if (orStatement != "") {
                    orStatement = "(" + orStatement + " " + thisOperator.toLowerCase() + " " + result + ")"
                } else {
                    orStatement = result
                }
            }
        });
        filter += orStatement
    } else {
        filter = buildQuery($xml1.find(firstNode), firstNode)
    }
    return filter
}

function buildQuery(node, firstNode) {
    var fieldName = ""
    var fieldValue = ""
    var qualifier = ""
        //lt le gt  ,   
    switch (firstNode) {
        case "Neq":
            qualifier = "ne"
            break
        case "Eq":
            qualifier = "eq"
            break
        case "Gt":
            qualifier = "gt"
            break
        case "Geq":
            qualifier = "ge"
            break
        case "Lt":
            qualifier = "lt"
            break
        case "Leq":
            qualifier = "le"
            break
        case "Contains":
            qualifier = "substringof"
            break
        case "BeginsWith":
            qualifier = "startswith"
            break
    }

    if (qualifier != "") {
        node.children("FieldRef").each(function(obj, child) {
            fieldName = child.attributes[0].value
            if (child.attributes.length > 1) {
                //if lookupid etc?
            }
        });
        if (node.children("Value").eq(0)[0].innerHTML.indexOf("UserID") != -1) {
            fieldValue = _spPageContextInfo.userId
        } else if (node.children("Value").eq(0)[0].innerHTML.indexOf("Today") != -1) {
            var searchDate = new Date()
            if (node.children("Value").eq(0)[0].innerHTML.indexOf("OffsetDays") != -1) {
                var statVar = node.children("Value").eq(0)[0].innerHTML.indexOf('"')
                var tmp = node.children("Value").eq(0)[0].innerHTML.substring(statVar + 1)
                var endVar = tmp.indexOf('"')
                tmp = tmp.substring(0, endVar)
                var minus = false
                if (tmp.indexOf("-") != -1) {
                    minus = true
                    tmp = tmp.replace("-", "")
                }

                if (minus) {
                    searchDate = new Date(new Date().setDate(new Date().getDate() - parseInt(tmp)))
                } else {
                    searchDate = new Date(new Date().setDate(new Date().getDate() + parseInt(tmp)))
                }
            }
            fieldValue = "datetime'" + searchDate.toISOString() + "'"
        } else {
            fieldValue = node.children("Value").eq(0)[0].textContent
        }
        node.children("Value").each(function(obj, child) {
            //fieldValue = node.children("Value").eq(0)[0].textContent 
            if (child.attributes[0].value == "Text") {
                fieldValue = "'" + fieldValue + "'"
            }
            if (child.attributes[0].value == "DateTime") {
                if (fieldValue.indexOf("'") == -1) {
                    fieldValue = "'" + fieldValue + "'"
                }
            }
        });

        var filter = "(" + fieldName + " " + qualifier + " " + fieldValue + ")"
        return filter
    }
    return ""
}