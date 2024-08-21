function buildContractWorkspace(pageTable) {
    buildContractCards()
    buildTaskCard("Contract", "row1Col3")
    showStagesTimeline("row2Col1", "Contracts", "")
    activeContracts("row2Col2")
    buildTaskTable("row7Col1", "Contract", "")
    ContractsAboutToRenew("Contracts", "row7Col2")
}

function ContractDetails(ContractID) {
    sprLib.list({ name: 'Contracts', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'EndDate', 'Reviewer/Id', 'Reviewer/Title', 'MSCPrimaryProvider/Title', 'PartnershipType/Title', 'Client/Id', 'Client/Title', 'DocumentRootFolder', 'StandardContract', 'Status', 'Value', 'MSCBillToNumber', 'Stages', 'Meetings', 'KeyFacts', 'Clauses', 'Timeline', 'Obligations', 'CCN', 'Risks', 'RACIChart', 'KPIs', 'Contacts', 'ContractPerformance', 'ContractOfferSchedule', 'ReferenceNo', 'ContractOrders', 'ContractSites', 'SalesManager/Title', 'AccountManager/Title', 'Users/Title', 'ProcurementRoute/Title', 'NHSPathologyName/Title', 'NoKPIsApplicable'],
            queryFilter: '(Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<a href="javascript:openItem(&#39;Contracts&#39;,' + ContractID + ');"><h5 class="card-title"><i class="header-icon fas fa-archive"></i> Contract Details</h5></a>'
            arrItems.forEach(function(obj, idx) {
                var startDate = formatDates(obj["StartDate"]);
                var endDate = formatDates(obj["EndDate"]);
                var refNo = "&nbsp;";
                if (obj["ReferenceNo"]) {
                    refNo = obj["ReferenceNo"]
                }
                var newDesc = obj["Title"]
                newDesc += '<div class="page-title-subheading">Reference No: ' + refNo + '</div>'
                $('#dashboardTitle').html(newDesc)
                var MSCPrimaryProvider = "&nbsp;"
                if (obj["MSCPrimaryProvider"]) {
                    MSCPrimaryProvider = obj["MSCPrimaryProvider"].Title
                }

                var NHSPathologyName = "&nbsp;"
                if (obj["NHSPathologyName"]) {
                    NHSPathologyName = obj["NHSPathologyName"].Title
                }
                var ProcurementRoute = "&nbsp;"
                if (obj["ProcurementRoute"]) {
                    ProcurementRoute = obj["ProcurementRoute"].Title
                }

                var billTo = "&nbsp;";
                if (obj["MSCBillToNumber"]) {
                    billTo = obj["MSCBillToNumber"]
                }
                var KPIs = obj["KPIs"]
                if (KPIs == 1) {
                    NoKPIsApplicable = obj["NoKPIsApplicable"]
                }
                var liHtml = "<table class='mb-0 table'><tbody><tr>" +
                    "<td>Start Date:</td><td colspan='3'>" + startDate + "</td></tr>" +
                    "<tr><td>End Date:</td><td id='contEndDate'>" + endDate + "</td></tr>" +
                    "<tr><td>Extension:</td><td id='endExtension'></td></tr>" +
                    "<tr><td>MSC Primary Provider:</td><td colspan='3'>" + MSCPrimaryProvider + "</td></tr>" +
                    "<tr><td>Procurement Route:</td><td colspan='3'>" + ProcurementRoute + "</td></tr>" +
                    "<tr><td>NHS Pathology Name:</td><td colspan='3'>" + NHSPathologyName + "</td></tr>" +
                    "<tr><td>MSC Bill To Number:</td><td colspan='3'>" + billTo + "</td></tr><tbody></table>";
                card += liHtml
                BuildDocumentMenu(obj["Title"], obj["DocumentRootFolder"])
                DocsDisplay(obj["DocumentRootFolder"], obj["Title"], "row1Col3", "/ContractDocuments")

                buildTimeline(obj["Id"], 'row2Col1', 'Contract')

                if (obj["Stages"]) {
                    showStagesTimeline("row1Col2", "Contracts", ContractID)
                    $('#ContractStages').css('display', '')
                } else { $('#ContractStages').css('display', 'none') }
                if (obj["ContractSites"]) {
                    showContractSites("conRow3Col1", ContractID)
                    $('#ContractSites').css('display', '')
                } else { $('#ContractSites').css('display', 'none') }
                if (obj["Clauses"]) {
                    showClauses("conRow6Col1", ContractID)
                    $('#Clauses').css('display', '')
                } else { $('#Clauses').css('display', 'none') }
                if (obj["ContractOfferSchedule"]) {
                    showContractOfferSchedule("conRow4Col1", ContractID)
                }
                if (obj["ContractPerformance"]) {
                    showPerformance("conRow8Col1", ContractID)
                    $('#ContractPerformance').css('display', '')
                } else { $('#ContractPerformance').css('display', 'none') }
                if (obj["Meetings"]) {
                    $('#Meetings').css('display', '')
                } else { $('#Meetings').css('display', 'none') }
                if (obj["Obligations"]) {
                    $('#Obligations').css('display', '')
                } else { $('#Obligations').css('display', 'none') }
                if (obj["KeyFacts"]) {
                    $('#KeyFacts').css('display', '')
                } else { $('#KeyFacts').css('display', 'none') }
                if (obj["RACIChart"]) {
                    $('#RACIChart').css('display', '')
                } else { $('#RACIChart').css('display', 'none') }
                if (obj["Risks"]) {
                    $('#AllRisks').css('display', '')
                } else { $('#AllRisks').css('display', 'none') }
                if (obj["CCN"]) {
                    $('#CCN').css('display', '')
                } else { $('#CCN').css('display', 'none') }
                if (obj["KPIs"]) {
                    NoKPIsApplicable = obj["NoKPIsApplicable"]
                    showKPIs("conRow7Col1", ContractID)
                    $('#KPIs').css('display', '')
                } else { $('#KPIs').css('display', 'none') }
                if (obj["ContractOrders"]) {
                    showContractOrders("conRow6Col2", ContractID)
                    $('#ContractOrders').css('display', '')
                } else { $('#ContractOrders').css('display', 'none') }
            });

            card += '</div>'
            card += '</div>'
            $('#row1Col1').html(card)

        });
}

function BuildDocumentMenu(projectName, DocumentRootFolder) {
    $().SPServices({
        operation: "GetListItems",
        webURL: _spPageContextInfo.webServerRelativeUrl + "/ContractDocuments/",
        listName: projectName,
        completefunc: function(xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
                var fileName = ""
                if ($(this).attr("ows_LinkFilename")) {
                    fileName = $(this).attr("ows_LinkFilename")
                    var fileURL = "/" + $(this).attr("ows_FileRef").split("#")[1]
                    menuHTML = "<li id='" + $(this).attr("ows_LinkFilename").replace(/ /g, "") + "'>"
                    menuHTML += "<a href='" + fileURL + "' target='_blank'>"
                    menuHTML += "<div docRootFolder='" + DocumentRootFolder + "' page='" + fileName.replace(/ /g, "") + "' icon='fas fa-book' folder='" + fileName + "' class='docView'>" + fileName + "</div>"
                    menuHTML += "</a>"
                    menuHTML += "</li>"
                    $("#ContractDocuments").append(menuHTML);
                }
            });
            $('.docView').click(function() {
                openDocument($(this))
            });
        }
    });

}

function openDocument(obj) {
    var newURL = obj.attr("docRootFolder") + "/" + obj.attr("folder")
    window.open(newURL, '_blank');
}

function activeContracts(pageCard) {
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Contracts/MyContracts.aspx">'
    card += '<i class="header-icon fas fa-file-alt" style="color: #62b6fa !important"></i> My Active Contracts</a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='contBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Contract</th><th>Reviewer</th><th>Status</th><th>End Date</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list({
            name: "Contracts",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'EndDate', 'Title', 'PartnershipType/Title', 'Reviewer/Title', 'Client/Title', 'Status', 'ContractType/Title'],
            queryFilter: '(Reviewer eq ' + objUserId + ') or (Author eq ' + objUserId + ') or (Users eq ' + objUserId + ')',
            queryOrderby: 'Title',
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {

                var validDate = formatDates(obj["EndDate"]);

                var Client = ""
                if (obj["Client"]) {
                    Client = obj["Client"].Title
                }
                var reviewer = ""
                if (obj["Reviewer"]) {
                    reviewer = obj["Reviewer"].Title
                }
                var badge = "badge-info"
                switch (obj["Status"]) {
                    case "Completed":
                        badge = 'badge-success'
                        break;
                    case "Live":
                        badge = "badge-info"
                        break;
                    case "Cancelled":
                        badge = "badge-danger"
                        break;
                    case "Negotiation":
                        badge = "badge-warning"
                        break;
                    case "Renewed":
                        badge = "badge-Primary"
                        break;
                    case "Extended":
                        badge = "badge-dark"
                        break;
                }
                var client = obj["Client"] ? obj["Client"].Title : "";
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="Contracts">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Contracts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href="ContractInfo.aspx?ContractID=' + obj["Id"] + '&ContractTitle=' + escapeProperly(obj["Title"]) + '" target="_blank">' + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + Client + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + reviewer + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + badge + '">' + obj["Status"] + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["EndDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            if ($.fn.dataTable.isDataTable('#mainTable')) {} else {
                var table = $('#mainTable').DataTable({
                    "order": []
                });
            }
            $('#contBusy').css("display", "none")
        });
}

function buildContractCards() {
    var statusValues = []
    var statusData = []
    sprLib.list({
            name: "Contracts",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'EndDate', 'Title', 'PartnershipType/Title', 'Reviewer/Title', 'Client/Title', 'Status', 'ContractType/Title']
        })
        .then(function(arrItems) {
            var card1 = '<div id="firstCard" class="card mb-3 widget-content bg-midnight-bloom clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Total Contracts</div>'
            card1 += '<div class="widget-subheading">All Contracts Created</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col1').html(card1)
            $('#firstCard').click(function() {
                openList("Contracts", "All Items", "", "_blank")
            });
            arrItems.forEach(function(obj, idx) {
                if (obj["ContractType"]) {
                    if (jQuery.inArray(obj["ContractType"].Title, statusValues) != -1) {
                        statusData[jQuery.inArray(obj["ContractType"].Title, statusValues)] += 1
                    } else {
                        statusValues.push(obj["ContractType"].Title)
                        statusData.push(1)
                    }
                }
            });
            ContractStatusChart(statusValues, statusData)
        });

    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59Z"
    sprLib.list({
            name: 'Contracts',
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: '(EndDate le "' + today + '")',
        })
        .then(function(arrItems) {
            var card1 = '<div id="secondCard" class="card mb-3 widget-content bg-danger clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Expired Contracts</div>'
            card1 += '<div class="widget-subheading">Contracts Passed End Date</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col2').html(card1)
            $('#secondCard').click(function() {
                openList("Contracts", "Expired Contracts", "", "_blank")
            });
        });


}

function ContractStatusChart(statusValues, statusData) {
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon fas fa-file-alt" style="color: #62b6fa !important"></i> '
    pieCard += 'Contract Types'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="card-body">'
    pieCard += '<canvas id="myChart" width="200" height="200"></canvas>'
    pieCard += '</div>'
    pieCard += '</div>'

    $('#row9Col1').html(pieCard)
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statusValues,
            datasets: [{
                label: 'Contract Status',
                data: statusData,
                backgroundColor: chroma.scale(['#de2366', '#0663ae']).mode('lch').colors(statusValues.length)
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            }
        }
    });

}

function ContractsAboutToRenew(pageTable, pageCard) {

    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Contracts/AboutToRenew.aspx">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-file-alt" style="color: #62b6fa !important"></i> Contracts about to Renew</div></a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='contRenewBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="contractRenewTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Contract</th><th>Reviewer</th><th>Start Date</th><th>Renewal Date</th></tr>'

    $('#contractRenewTable thead').append(headers)

    var quarterly = moment(new Date()).add(91, 'days').format('YYYY-MM-DD') + "T00:00:00";
    sprLib.list('Contracts')
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'RenewalDate', 'ContractType/Title', 'Reviewer/Title'],
            queryFilter: 'RenewalDate le "' + quarterly + '"',
            queryOrderby: 'RenewalDate'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var projManager = ""

                var contType = obj["ContractType"] ? obj["ContractType"].Title : "";
                var Reviewer = obj["Reviewer"] ? obj["Reviewer"].Title : "";
                var tbleRow = '<tr class="contractRenewTableRow" recid="' + obj["Id"] + '" table="' + pageTable + '">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;' + pageTable + '&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href=ContractInfo.aspx?ContractID=' + obj["Id"] + '&ContractTitle=' + escapeProperly(obj["Title"]) + " target='_blank'>" + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + contType + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + Reviewer + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div>' + formatDates(obj["StartDate"]) + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["RenewalDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#contractRenewTable tbody').append(tbleRow)
            });
            $('#contractRenewTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            if ($.fn.dataTable.isDataTable('#contractRenewTable')) {} else {
                var table = $('#contractRenewTable').DataTable({
                    "order": []
                });
            }
            $('#contRenewBusy').css("display", "none")
        });
}

function showKPIs(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/KPIs/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> KPIs'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;KPIs&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="KPITable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>KPI No</th><th>KPI Title</th><th>KPI Type</th><th>KPI Description</th><th>Pass Target</th></tr>'
    $('#KPITable thead').append(headers)
    if (NoKPIsApplicable == 1) {
        var liHtml = "<div class='kpis' style='width:1220px;font-weight:bold;'>No KPIs Applicable</div>";
        $("#KPIs").append(liHtml);
        return;
    }

    sprLib.list({ name: 'KPIs', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'KPI/Title', 'KPIType/Title', 'KPINo', 'PassTarget', 'KPIDescription', 'ServiceCredits', 'ValueOfBreachPoints'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'KPIType/Title, KPINo, Id'
        })
        .then(function(arrItems) {
            var lastNo = ""
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;"
                var kpiType = "&nbsp;"
                var KPINo = "&nbsp;"
                var desc = "&nbsp;"
                var fulldesc = "";
                /*if (lastNo != obj["KPINo"]){
                    lastNo = obj["KPINo"]*/
                if (obj["KPI"]) {
                    title = obj["KPI"].Title ? obj["KPI"].Title : "&nbsp;"
                }

                if (obj["KPIType"]) {
                    kpiType = obj["KPIType"].Title ? obj["KPIType"].Title : "&nbsp;"
                }

                if (obj["KPINo"]) {
                    KPINo = obj["KPINo"]
                }
                desc = obj["KPIDescription"] ? obj["KPIDescription"] : "&nbsp;";
                fulldesc = desc
                    // if (desc.length > 50) {
                    //     desc = desc.substring(0, 47) + "..."
                    // }

                var pass = obj["PassTarget"] ? obj["PassTarget"] : "&nbsp;";
                // pass = pass.length > 20 ? pass.substring(0, 17) + "..." : pass;
                var credit = obj["ServiceCredits"] ? obj["ServiceCredits"] : "&nbsp;";
                // credit = credit.length > 20 ? credit.substring(0, 17) + "..." : credit;
                var bp = "&nbsp;"
                var fullbp = ""
                if (obj["ValueOfBreachPoints"]) {
                    fullbp = obj["ValueOfBreachPoints"]
                        // bp = obj["ValueOfBreachPoints"].length > 20 ? obj["ValueOfBreachPoints"].substring(0, 17) + "..." : obj["ValueOfBreachPoints"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;KPIs&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + KPINo + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + kpiType + '</td>'
                tbleRow += '<td>' + desc + '</td>'
                tbleRow += '<td>' + pass + '</td>'
                tbleRow += '<td>' + credit + '</td>'
                tbleRow += '<td>' + bp + '</td>'
                tbleRow += '</tr>'
                $('#KPITable tbody').append(tbleRow)
            });
        });
}

function showPerformance(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ContractPerformance/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Performance'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ContractPerformance&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="PerformanceTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Service No</th><th>Product</th><th>Type</th><th>Status</th><th>Entry Date<br>Time</th><th>Closed Date<br>Time</th></tr>'
    $('#PerformanceTable thead').append(headers)
    sprLib.list({ name: 'Contract Performance', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Product/Title', 'Status', 'ItemType', 'EntryDateTime', 'ClosedDateTime'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;"
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var status = "&nbsp;"
                if (obj["Status"]) {
                    status = obj["Status"];
                    var badge = "badge-info"
                    switch (obj["Status"]) {
                        case "Current":
                            badge = 'badge-success'
                            break;
                        case "Past":
                            badge = "badge-Light"
                            break;
                        case "Potential":
                            badge = "badge-primary"
                            break;
                    }
                }
                var product = "&nbsp;"
                if (obj["Product"]) {
                    if (obj["Product"].Title) {
                        product = obj["Product"].Title;
                    }
                }
                var type = "&nbsp;"
                if (obj["ItemType"]) {
                    type = obj["ItemType"];
                }

                var entryDate = formatDates(obj["EntryDateTime"])
                var closedDate = formatDates(obj["ClosedDateTime"])
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ContractPerformance&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + product + '</td>'
                tbleRow += '<td>' + type + '</td>'
                tbleRow += '<td><div class="badge ' + badge + '">' + status + '</div></td>'
                tbleRow += '<td>' + entryDate + '</td>'
                tbleRow += '<td>' + closedDate + '</td>'
                tbleRow += '</tr>'
                $('#PerformanceTable tbody').append(tbleRow)
            });
        });
}

function showContractSites(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ContractSites/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Sites'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ContractSites&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="SitesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Trust</th><th>MSC Specialist</th></tr>'
    $('#SitesTable thead').append(headers)
    sprLib.list({ name: 'Contract Sites', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'NHSTrust/Title', 'Specialist/Title', 'SalesManager/Title', 'AccountManager/Title'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'NHSTrust/Title desc'
        })
        .then(function(arrItems) {
            var salesManager = ""
            var accountManager = ""
            arrItems.forEach(function(obj, idx) {
                if (obj["SalesManager"]) {
                    if (salesManager == "") {
                        salesManager = obj["SalesManager"].Title ? obj["SalesManager"].Title : "";
                    } else {
                        if (salesManager.indexOf(obj["SalesManager"].Title) == -1) {
                            salesManager += obj["SalesManager"].Title ? "; " + obj["SalesManager"].Title : "";
                        }
                    }
                }
                if (obj["AccountManager"]) {
                    if (accountManager == "") {
                        accountManager = obj["AccountManager"].Title ? obj["AccountManager"].Title : "";
                    } else {
                        if (accountManager.indexOf(obj["AccountManager"].Title) == -1) {
                            accountManager += obj["AccountManager"].Title ? "; " + obj["AccountManager"].Title : "";
                        }
                    }
                }
                var title = "&nbsp;"
                if (obj["NHSTrust"]) {
                    title = obj["NHSTrust"].Title;
                }
                var Specialist = "&nbsp;"
                if (obj["Specialist"]) {
                    Specialist = obj["Specialist"].Title
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ContractSites&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + Specialist + '</td>'
                tbleRow += '</tr>'
                $('#SitesTable tbody').append(tbleRow)
            });
            $('#salesManager').text(salesManager)
            $('#accountManager').text(accountManager)
        });
}

function showMaintenanceDates(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/MaintenanceRentalDates/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Maintenance and Rental Dates'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;MaintenanceRentalDates&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="MaintenanceTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Service Max<br>Location</th><th>Serial Number</th><th>Installed Product</th><th>MAintenance Cover<br>End Date</th><th>Maintenance P/A</th><th>Rental Cover<br>End Date</th><th>Rental P/A</th></tr>'
    $('#MaintenanceTable thead').append(headers)
    sprLib.list({ name: 'Maintenance and Rental Dates', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'ServiceMaxLocation/Title', 'InstalledProduct/Title', 'MaintenanceCoverEndDate', 'MaintenancePA', 'RentalCoverEndDate', 'RentalPA'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var MaintenanceCoverEndDate = obj["MaintenanceCoverEndDate"] ? formatDates(obj["MaintenanceCoverEndDate"]) : "&nbsp;"
                var RentalCoverEndDate = obj["RentalCoverEndDate"] ? formatDates(obj["RentalCoverEndDate"]) : "&nbsp;"
                var ServiceMaxLocation = "&nbsp;"
                if (obj["ServiceMaxLocation"]) {
                    ServiceMaxLocation = obj["ServiceMaxLocation"].Title ? obj["ServiceMaxLocation"].Title : "&nbsp;"
                }
                var InstalledProduct = "&nbsp;"
                if (obj["InstalledProduct"]) {
                    InstalledProduct = obj["InstalledProduct"].Title ? obj["InstalledProduct"].Title : "&nbsp;"
                }
                var SerialNumber = obj["Title"] ? obj["Title"] : "&nbsp;"
                var MaintenancePA = obj["MaintenancePA"] ? obj["MaintenancePA"] : "&nbsp;"
                var RentalPA = obj["RentalPA"] ? obj["RentalPA"] : "&nbsp;"
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;MaintenanceRentalDates&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + ServiceMaxLocation + '</td>'
                tbleRow += '<td>' + SerialNumber + '</td>'
                tbleRow += '<td>' + InstalledProduct + '</td>'
                tbleRow += '<td>' + MaintenanceCoverEndDate + '</td>'
                tbleRow += '<td>' + MaintenancePA + '</td>'
                tbleRow += '<td>' + RentalCoverEndDate + '</td>'
                tbleRow += '<td>' + RentalPA + '</td>'
                tbleRow += '</tr>'
                $('#MaintenanceTable tbody').append(tbleRow)
            });
        });

}

function showServiceLogSchedule(cardID, RecID) {
    var section = ""
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ServiceLogs/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Service Logs'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ServiceLogs&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ServiceLogsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Serial Number</th><th>Asset Tag</th><th>Case</th><th>Work Order Priority</th><th>Notified Date</th><th>Actual Restoration</th></tr>'
    $('#ServiceLogsTable thead').append(headers)
    sprLib.list({ name: 'Service Logs', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'AssetTag', 'Product/Title', 'CaseNumber', 'WorkOrderNumber', 'WorkOrderPriority', 'NotifiedDate', 'ActualRestoration', 'SerialNumber'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var AssetTag = obj["AssetTag"] ? obj["AssetTag"] : "&nbsp;"

                var Product = "&nbsp;"
                if (obj["Product"]) {
                    Product = obj["Product"].Title ? obj["Product"].Title : "&nbsp;"
                }
                var Case = obj["CaseNumber"] ? obj["CaseNumber"] : "&nbsp;"
                var WorkOrderNumber = obj["WorkOrderNumber"] ? obj["WorkOrderNumber"] : "&nbsp;"
                var WorkOrderPriority = obj["WorkOrderPriority"] ? obj["WorkOrderPriority"] : "&nbsp;"
                var SerialNumber = obj["SerialNumber"] ? obj["SerialNumber"] : "&nbsp;"

                var NotifiedDate = formatDates(obj["NotifiedDate"], true);
                var ActualRestoration = formatDates(obj["ActualRestoration"], true);
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ServiceLogs&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + Product + '</td>'
                tbleRow += '<td>' + SerialNumber + '</td>'
                tbleRow += '<td>' + AssetTag + '</td>'
                tbleRow += '<td>' + Case + '</td>'
                tbleRow += '<td>' + WorkOrderPriority + '</td>'
                tbleRow += '<td>' + NotifiedDate + '</td>'
                tbleRow += '<td>' + ActualRestoration + '</td>'
                tbleRow += '</tr>'
                $('#ServiceLogsTable tbody').append(tbleRow)
            });
        });
}

function showContractOfferSchedule(cardID, RecID) {
    var section = ""
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ContractOfferSchedule/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Pricing Expiry Dates'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ContractOfferSchedule&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="OfferScheduleTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Division</th><th>Service</th><th>Pricing Tariff<br>Agreement Number</th><th>Pricing Start Date</th><th>Pricing End Date</th><th>Allowed Indexation</th></tr>'
    $('#OfferScheduleTable thead').append(headers)
    sprLib.list({ name: 'Contract and Pricing Expiry Dates', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'BusinessUnit/Title', 'CountryBusinessLeader/Title', 'BusinessCategory/Title', 'Division/Title', 'Service/Title', 'ContractStartDate', 'ContractEndDate', 'ContractExtension', 'ContractExtension2', 'ContractExtension3', 'ContractExtension4', 'ContractExtension5', 'ContractExtension6', 'ContractExtension7', 'PricingTarriff', 'PricingStartDate', 'PricingEndDate'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')'
        })
        .then(function(arrItems) {
            var lastExtension = ""
            var lastNumber = -1
            var actualEndDate
                // if ($('#contEndDate').html() != ""){
                //         if ($('#contEndDate').html().length == 10 && $('#contEndDate').html().indexOf("/") != -1){
                //             var tmpD = $('#contEndDate').html().split("/")
                //             actualEndDate = new Date(tmpD[2],parseInt(tmpD[1])-1,tmpD[0])
                //         }
                //     }
            arrItems.forEach(function(obj, idx) {
                var division = "&nbsp;"
                if (obj["Division"]) {
                    division = obj["Division"].Title ? obj["Division"].Title : "&nbsp;"
                }
                var service = "&nbsp;"
                if (obj["Service"]) {
                    service = obj["Service"].Title ? obj["Service"].Title : "&nbsp;"
                }
                var indexation = "&nbsp;"
                if (obj["ContractExtension"]) {
                    if (lastNumber < 1) {
                        lastNumber = 1
                        lastExtension = obj["ContractExtension"] != "" ? obj["ContractExtension"] : "";
                    }
                    if (obj["ContractExtension"].trim().length == 10 && obj["ContractExtension"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension2"]) {
                    if (lastNumber < 2) {
                        lastNumber = 2
                        lastExtension = obj["ContractExtension2"] != "" ? obj["ContractExtension2"] : "";
                    }
                    if (obj["ContractExtension2"].trim().length == 10 && obj["ContractExtension2"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension2"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension3"]) {
                    if (lastNumber < 3) {
                        lastNumber = 3
                        lastExtension = obj["ContractExtension3"] != "" ? obj["ContractExtension3"] : "";
                    }
                    if (obj["ContractExtension3"].trim().length == 10 && obj["ContractExtension3"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension3"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension4"]) {
                    if (lastNumber < 4) {
                        lastNumber = 4
                        lastExtension = obj["ContractExtension4"] != "" ? obj["ContractExtension4"] : "";
                    }
                    if (obj["ContractExtension4"].trim().length == 10 && obj["ContractExtension4"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension4"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension5"]) {
                    if (lastNumber < 5) {
                        lastNumber = 5
                        lastExtension = obj["ContractExtension5"] != "" ? obj["ContractExtension5"] : "";
                    }
                    if (obj["ContractExtension5"].trim().length == 10 && obj["ContractExtension5"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension5"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension6"]) {
                    if (lastNumber < 6) {
                        lastNumber = 6
                        lastExtension = obj["ContractExtension6"] != "" ? obj["ContractExtension6"] : "";
                    }
                    if (obj["ContractExtension6"].trim().length == 10 && obj["ContractExtension6"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension6"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }
                if (obj["ContractExtension7"]) {
                    if (lastNumber < 7) {
                        lastNumber = 7
                        lastExtension = obj["ContractExtension7"] != "" ? obj["ContractExtension7"] : "";
                    }
                    if (obj["ContractExtension7"].trim().length == 10 && obj["ContractExtension7"].indexOf("/") != -1) {
                        var tmpD = obj["ContractExtension7"].split("/")
                        var actDate = new Date(tmpD[2], parseInt(tmpD[1]) - 1, tmpD[0])
                        if (actDate > actualEndDate) {
                            actualEndDate = actDate
                        }
                    }
                }


                var PricingTarriff = obj["PricingTarriff"] ? obj["PricingTarriff"] : "";
                var PricingStartDate = formatDates(obj["PricingStartDate"]);
                var PricingEndDate = formatDates(obj["PricingEndDate"]);
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ContractOfferSchedule&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + division + '</td>'
                tbleRow += '<td>' + service + '</td>'
                tbleRow += '<td>' + PricingTarriff + '</td>'
                tbleRow += '<td>' + PricingStartDate + '</td>'
                tbleRow += '<td>' + PricingEndDate + '</td>'
                tbleRow += '<td>' + indexation + '</td>'
                tbleRow += '</tr>'
                $('#OfferScheduleTable tbody').append(tbleRow)
            });
            if (actualEndDate) {
                var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
                fieldXML += "<Method ID='1' Cmd='Update'>"
                fieldXML += "<Field Name='ID'>" + getParameterByName("ContractID") + "</Field>"
                var dd = String(actualEndDate.getDate()).padStart(2, '0');
                var mm = String(actualEndDate.getMonth() + 1).padStart(2, '0');
                var yyyy = actualEndDate.getFullYear();
                var updateEndDate = yyyy + "-" + mm + "-" + dd + "T00:00:00Z"
                fieldXML += "<Field Name='ActualEndDate'>" + updateEndDate + "</Field>"
                fieldXML += "</Method>"
                fieldXML += "</Batch>"
                updateItem("Contracts", fieldXML, true);
            }
            $('#endExtension').html(lastExtension)
        });
}

function showContractOrders(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ContractOrders/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Orders'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ContractOrders&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="OrdersTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Order Number</th><th>Product</th><th>Quantity</th><th>Price</th></tr>'
    $('#OrdersTable thead').append(headers)
    sprLib.list({ name: 'Contract Orders', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Quantity', 'Product/Title', 'Price'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;"
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var product = "&nbsp;"
                var fullProduct = "&nbsp;"
                if (obj["Product"]) {
                    if (obj["Product"].Title) {
                        product = obj["Product"].Title;
                        fullProduct = obj["Product"].Title;
                        // product = product.length > 20 ? product.substring(0, 18) + "..." : product
                    }
                }
                var quantity = "&nbsp;"
                if (obj["Quantity"]) {
                    quantity = obj["Quantity"];
                }
                var price = 0.00
                if (obj["Price"]) {
                    price = obj["Price"];
                }
                price = obj["Price"];
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ContractOrders&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + product + '</td>'
                tbleRow += '<td>' + quantity + '</td>'
                tbleRow += '<td>' + parseFloat(price).toFixed(2) + '</td>'
                tbleRow += '</tr>'
                $('#OrdersTable tbody').append(tbleRow)
            });
        });
}

function showClauses(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Clauses/AllItems.aspx?ContractTitle=' + getParameterByName("ContractTitle") + '&ContractID=' + RecID + '&FilterField1=Contract_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #62b6fa !important"></i> Clauses'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Clauses&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ClausesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Clause</th><th>Risk</th><th>Financial<br>Impact</th><th>Management<br>Action</th><th>Mitigation</th></tr>'
    $('#ClausesTable thead').append(headers)
    sprLib.list({ name: 'Clauses', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Risk', 'FinancialImpact', 'ManagementAction', 'Mitigation'],
            queryFilter: '(Contract/Id eq ' + getParameterByName("ContractID") + ')',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;"
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var risk = "&nbsp;"
                if (obj["Risk"]) {
                    risk = obj["Risk"];
                    var badge = "badge-info"
                    switch (risk) {
                        case "Low":
                            badge = 'badge-success'
                            break;
                        case "High":
                            badge = "badge-danger"
                            break;
                        case "Medium":
                            badge = "badge-warning"
                            break;
                    }
                }
                var impact = 0
                if (obj["FinancialImpact"]) {
                    impact = obj["FinancialImpact"];
                }
                var action = "&nbsp;"
                if (obj["ManagementAction"]) {
                    action = obj["ManagementAction"];
                }
                var mitigation = "&nbsp;"
                if (obj["Mitigation"]) {
                    mitigation = obj["Mitigation"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Clauses&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td><div class="badge ' + badge + '">' + risk + '</div></td>'
                tbleRow += '<td>' + shortenLargeNumber(parseFloat(impact).toFixed(2), 2) + '</td>'
                tbleRow += '<td>' + action + '</td>'
                tbleRow += '<td>' + mitigation + '</td>'
                tbleRow += '</tr>'
                $('#ClausesTable tbody').append(tbleRow)
            });
        });
}