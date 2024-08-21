function buildSubContractors() {
    showSubContractor("row5col2")
}

function showSubContractor(pageCard) {
    var typeName = [];
    var typeData = [];
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Subcontractors/AllItems.aspx">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #9f95cb !important"></i> Partners</div></a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='partnerBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Name</th><th>Registration No</th><th>Contact Name</th><th>Contact Email</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list('Subcontractors')
        .items({
            listCols: ['Id', 'RegistrationNo', 'MainContact', 'Title', 'ContactEmail', 'Status'],
            queryOrderby: 'Title'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                // var title = obj["Title"].length > 45 ? obj["Title"].substring(0, 43) + "..." : obj['Title']
                var regno = obj["RegistrationNo"] ? obj["RegistrationNo"] : "&nbsp;"
                var contact = obj["MainContact"] ? obj["MainContact"] : "&nbsp;"
                var email = obj["ContactEmail"] ? obj["ContactEmail"] : "&nbsp;"
                var type = ""
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="Competitors">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Subcontractors&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href="SubcontractorInfo.aspx?SubconID=' + obj["Id"] + '&SubconTitle=' + escapeProperly(obj["Title"]) + '" target="_blank">' + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + type + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + regno + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div>' + contact + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += email
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
                if (obj["Status"]) {
                    if (jQuery.inArray(obj["Status"], typeName) == -1) {
                        typeName.push(obj["Status"])
                        typeData.push(1)
                    } else {
                        typeData[jQuery.inArray(obj["Status"], typeName)] += 1
                    }
                }
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            if ($.fn.dataTable.isDataTable('#mainTable')) {} else {
                var table = $('#mainTable').DataTable({
                    "order": []
                });
            }
            subcontractorChart(typeName, typeData)
            $('#partnerBusy').css("display", "none")
        });
}

function subcontractorChart(statusValues, statusData) {
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon fas fa-users" style="color: #9f95cb !important"></i> '
    pieCard += 'Partners'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="card-body">'
    pieCard += '<canvas id="myChart" width="200" height="200"></canvas>'
    pieCard += '</div>'
    pieCard += '</div>'

    $('#row5col1').html(pieCard)
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statusValues,
            datasets: [{
                label: 'Partners',
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

function SubcontractorDetails(SubconID) {
    sprLib.list({ name: 'Subcontractors', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'RegistrationNo', 'MainContract/Title', 'SubcontractorName', 'CurrentPhase', 'SubcontractStartDate', 'SubcontractEndDate', 'ExtensionOption', 'DocumentRootFolder'],
            queryFilter: '(Id eq "' + SubconID + '")',
            queryOrderby: 'Created desc',
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<a href="javascript:openItem(&#39;Subcontractors&#39;,' + SubconID + ');"><h5 class="card-title"><i class="header-icon fas fa-archive"></i> Partner Details</h5></a>'
            arrItems.forEach(function(obj, idx) {
                for (i = 1; i <= 5; i++) {
                    $('#phase' + i).html("")
                    $('#phase' + i).removeClass("complete")
                    $('#phase' + i).removeClass("inprogress")
                }
                if (obj["CurrentPhase"]) {
                    var currentPhase = 1
                    switch (obj["CurrentPhase"]) {
                        case "Phase I":
                            currentPhase = 1
                            break;
                        case "Phase II":
                            currentPhase = 2
                            break;
                        case "Phase III":
                            currentPhase = 3
                            break;
                        case "Phase IV":
                            currentPhase = 4
                            break;
                        case "Phase V":
                            currentPhase = 5
                            break;
                        case "Completed":
                            currentPhase = 6
                            break;
                    }
                    if (currentPhase < 6) {
                        $('#phase' + currentPhase).html("In Progress")
                        $('#phase' + currentPhase).addClass("inprogress")
                    }
                    for (i = 1; i < currentPhase; i++) {
                        $('#phase' + i).html("Complete")
                        $('#phase' + i).addClass("complete")
                    }

                }
                // var subcontractorDocumentsLink
                // if(obj["DocumentRootFolder"]){
                //     bindTreeView(obj["Title"].trim(), obj["DocumentRootFolder"])
                //     subcontractorDocumentsLink = obj["DocumentRootFolder"]
                // }
                // var subconQuestionLink = 'https://tendereyes.sharepoint.com/sites/TenderEyesV3/SitePages/Dashboards/SubcontractorQuestions.aspx?SubconID='+obj["Id"]+"&SubconTitle="+obj["Title"]
                // $('#subconDocuments').attr('href', subcontractorDocumentsLink).attr("target","_blank")
                // $('#subconQuestion').attr('href', subconQuestionLink).attr("target","_blank")

                DocsDisplay(obj["DocumentRootFolder"], obj["Title"], "subconRow1Col2", "/SubcontractorDocuments")

                var SubcontractorName = "&nbsp;";
                if (obj["Title"]) {
                    SubcontractorName = obj["Title"];
                }
                var MainContract = "&nbsp;";
                if (obj["MainContract"]) {
                    MainContract = obj["MainContract"].Title ? obj["MainContract"].Title : "&nbsp;";
                }
                var RegistrationNo = "&nbsp;";
                if (obj["RegistrationNo"]) {
                    RegistrationNo = obj["RegistrationNo"];
                }
                var email = "&nbsp;";
                var SubcontractStartDate = formatDates(obj["SubcontractStartDate"])
                var SubcontractEndDate = formatDates(obj["SubcontractEndDate"])
                var ExtensionOption = formatDates(obj["ExtensionOption"])
                $('.subContractorLink').each(function() {
                    $(this).attr("href", $(this).attr("href") + "?SubconTitle=" + escapeProperly(getParameterByName("SubconTitle")) + "&SubconID=" + getParameterByName("SubconID") + "&FilterField1=Subcontractor%5Fx003a%5FID&FilterValue1=" + getParameterByName("SubconID"))
                });
                var liHtml = "<table class='mb-0 table'><tbody><tr><td>Name:</td><td>" + SubcontractorName + "</td></tr>" +
                    "<tr><td>Start Date:</td><td>" + SubcontractStartDate + "</td></tr>" +
                    "<tr><td>End Date:</td><td>" + SubcontractEndDate + "</td></tr>" +
                    "<tr><td>Extension:</td><td>" + ExtensionOption + "</td></tr>" +
                    "<tr><td>NHS Trusts Supplied:</td><td>" + MainContract + "</td></tr>" +
                    "<tr><td>Company No:</td><td>" + RegistrationNo + "</td></tr>" +
                    "<tr><td></td><td></td></tr><tbody></table>";
                card += liHtml
            });
            card += '</div>'
            card += '</div>'
            $('#subconRow1Col1').html(card)
        });
}

function showContacts(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-address-card" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Contacts/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Contacts'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Contacts&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ContactsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Name</th><th>Title</th><th>Email</th><th>Sector of<br>Interest</th></tr>'
    $('#ContactsTable thead').append(headers)
    sprLib.list({ name: 'Contacts', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'SectorsOfInterest/Title', 'ContactTitle', 'EmailAddress', 'FileRef'],
            queryFilter: '(Subcontractor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var name = "&nbsp;";
                var fullName = ""
                if (obj["Title"]) {
                    fullName = obj["Title"];
                    name = obj["Title"];
                    // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var email = "&nbsp;";
                var fullEmail = ""
                if (obj["EmailAddress"]) {
                    fullEmail = obj["EmailAddress"];
                    email = obj["EmailAddress"];
                    // email = email.length > 30 ? email.substring(0, 28) + "..." : email
                }
                var sector = "&nbsp;"
                var fullSector = "&nbsp;"
                if (obj["SectorsOfInterest"]) {
                    var sectors = obj["SectorsOfInterest"]
                    sectors.forEach(function(sec, idx) {
                            sector = sector == "&nbsp;" ? sec.Title : sector + "; " + sec.Title
                            fullSector = fullSector == "&nbsp;" ? sec.Title : fullSector + "; " + sec.Title
                        })
                        // sector = sector.length > 30 ? sector.substring(0, 28) + "..." : sector
                }
                var title = "&nbsp;";
                var fullTitle = ""
                if (obj["ContactTitle"]) {
                    title = obj["ContactTitle"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Contacts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + email + '</td>'
                tbleRow += '<td>' + sector + '</td>'
                tbleRow += '</tr>'
                $('#ContactsTable tbody').append(tbleRow)

            });
        });
}

function showProjects(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorProjects/AllItems.aspx?SubcontractorTitle=' + getParameterByName("ProjectTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i> Projects'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorProjects&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='projPartnersBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="subcontractorsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center"><i class="far fa-folders"></i></th><th>Project</th><th>Reference<br> Number</th></tr>'
    $('#subcontractorsTable thead').append(headers)
    sprLib.list({ name: 'Subcontractor Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Project/Id', 'Project/Title', 'Project/ReferenceNo', 'Subcontractor/RegistrationNo', 'Subcontractor/MainContact'],
            queryFilter: '(Subcontractor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = obj["Project"].Title ? obj["Project"].Title : "&nbsp;";
                var subconId = obj["Project"].Id ? obj["Project"].Id : "&nbsp;";
                var regNo = obj["Project"].ReferenceNo ? obj["Project"].ReferenceNo : "&nbsp;";
                var subcontractorsTbleRow = '<tr>'
                subcontractorsTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorProjects&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                subcontractorsTbleRow += '<td class="text-center text-muted"><a href="javascript:openLink(&#39;'+title.replace(/\./g,"")+'&#39;)"><i class="far fa-folder"></i></a></td>'
                subcontractorsTbleRow += '<td><div class="widget-content p-0">'
                subcontractorsTbleRow += '<div class="widget-content-wrapper">'
                subcontractorsTbleRow += '<div class="widget-content-left flex2">'
                subcontractorsTbleRow += '<div class="widget-heading"><a style="color:#3f6ad8" href="' + _spPageContextInfo.webServerRelativeUrl + '/SitePages/ProjectInfo.aspx?ProjectID=' + subconId + '&ProjectTitle=' + title + '" target="_blank">' + title + '</a></div>'
                //subcontractorsTbleRow += '<div class="widget-subheading opacity-7">' + address + '</div>'
                subcontractorsTbleRow += '</div></div></div></td>'
                subcontractorsTbleRow += '<td>' + regNo + '</td>'
                subcontractorsTbleRow += '</tr>'
                $('#subcontractorsTable tbody').append(subcontractorsTbleRow)
            });
            $('#projPartnersBusy').css("display", "none")
        });
}

function openLink(name){
    var url = _spPageContextInfo.webServerRelativeUrl + "/Partners/"+ getParameterByName("SubconTitle") + "/" + name
    console.log(url)
    window.open(url, '_blank');
}

function showQuestions(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-book" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorQuestions/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Questions and Answers'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorQuestions&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="QuestionsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Category</th><th>Question</th><th>Status</th><th>Valid Date</th></tr>'
    $('#QuestionsTable thead').append(headers)
    var titleName = [];
    sprLib.list({ name: 'Subcontractor Questions', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'ValidUntil', 'Status', 'Category/Title'],
            queryFilter: '(Subcontractor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
        })
        .then(function(arrItems) {
            console.log(arrItems)
            arrItems.forEach(function(obj, idx) {
                var validDate = formatDates(obj["ValidUntil"]);
                var title = "";
                var fullTitle = ""
                if (obj["Title"]) {
                    title = obj["Title"]
                    fullTitle = obj["Title"]
                        //    title = title.length > 50 ? title.substring(0,47)+"..." : title;
                }
                var category = "&nbsp;"
                var fullCategory = ""
                if (obj["Category"]) {
                    var cats = obj["Category"]
                    cats.forEach(function(cat, idx) {
                        category = category == "&nbsp;" ? cat.Title : category + "; " + cat.Title
                    })
                    fullCategory = obj["Category"].Title
                        //    category = category.length > 30 ? category.substring(0,27)+"..." : category;
                }
                var status = "&nbsp;"
                if (obj["Status"]) {
                    status = obj["Status"];

                    var badge = "badge-info"
                    switch (status) {
                        case "Under Review":
                            badge = 'badge-warning'
                            break;
                        case "Reviewed":
                            badge = "badge-success"
                            break;
                        case "Chased":
                            badge = "badge-primary"
                            break;
                    }
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorQuestions&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + category + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td><div class="badge ' + badge + '">' + status + '</div></td>'
                tbleRow += '<td>' + validDate + '</td>'
                tbleRow += '</tr>'
                $('#QuestionsTable tbody').append(tbleRow)
            });
        });
}

function showContracts(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorContracts/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Contracts'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorContracts&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ContractsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Contract</th></tr>'
    $('#ContractsTable thead').append(headers)
    sprLib.list({ name: 'Subcontractor Contracts', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Contracts/Title'],
            queryFilter: '(Subcontractor/Id eq  ' + RecID + ')',
            queryOrderby: 'Contracts/Title',
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = ""
                var linkTitle = "&nbsp;"
                var status = "&nbsp;"
                if (obj["Contracts"]) {
                    var contract = obj["Contracts"].Title ? obj["Contracts"].Title : "&nbsp;"
                    var tbleRow = '<tr>'
                    tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorContracts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                    tbleRow += '<td class="text-center text-muted">' + obj["Contracts"].Id + '</td>'
                    tbleRow += '<td><a href=ContractInfo.aspx?ContractID=' + obj["Contracts"].Id + '&ContractTitle=' + escapeProperly(contract) + '" target="_blank">' + contract + '</a></td>'
                    tbleRow += '</tr>'
                    $('#ContractsTable tbody').append(tbleRow)
                }
            })
        })
}

function showProducts(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontratorProducts/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Products'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontratorProducts&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ProductsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Code</th><th>Product</th><th>Pack Size</th><th>Unit Price</th><th>Price</th></tr>'
    $('#ProductsTable thead').append(headers)
    sprLib.list({ name: 'Subcontrator Products', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'ProductDescription', 'UnitPrice', 'PackSize', 'PackPrice'],
            queryFilter: '(Subcontractor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;";
                if (obj["Title"]) {
                    title = obj["Title"]
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var Description = "&nbsp;";
                var ProductDescription = ""
                if (obj["ProductDescription"]) {
                    ProductDescription = obj["ProductDescription"];
                    Description = obj["ProductDescription"];
                    // Description = Description.length > 33 ? Description.substring(0,30)+"..." : Description
                }
                var productCode = 0
                if (obj["Code"]) {
                    productCode = obj["Code"];
                }
                var PackSize = 0
                if (obj["PackSize"]) {
                    PackSize = obj["PackSize"];
                }
                var UnitPrice = 0;
                if (obj["UnitPrice"]) {
                    UnitPrice = obj["UnitPrice"];
                }
                var PackPrice = 0;
                if (obj["PackPrice"]) {
                    PackPrice = obj["PackPrice"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontratorProducts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + Description + '</td>'
                tbleRow += '<td>' + PackSize + '</td>'
                tbleRow += '<td>' + shortenLargeNumber(parseFloat(UnitPrice).toFixed(2), 2) + '</td>'
                tbleRow += '<td>' + shortenLargeNumber(parseFloat(PackPrice).toFixed(2), 2) + '</td>'
                tbleRow += '</tr>'
                $('#ProductsTable tbody').append(tbleRow)
            });
        });

}

function showShipToSites(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorShipto/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Ship To'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorShipto&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ShipToTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Ship-to-Number</th><th>BD PO<br>Number</th><th>Start Date</th><th>Expiry Date</th></tr>'
    $('#ShipToTable thead').append(headers)
    sprLib.list({ name: 'Subcontractor Ship to', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'PONumber', 'POStartDate', 'POEndDate'],
            queryFilter: '(Subcontractor/Id eq  ' + RecID + ')'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var Code = "&nbsp;";
                var ShipToNumber = ""
                if (obj["Title"]) {
                    ShipToNumber = obj["Title"];
                }
                var PONumber = "&nbsp;";
                if (obj["PONumber"]) {
                    PONumber = obj["PONumber"];
                }
                var POStartDate = formatDates(obj["POStartDate"])
                var POEndDate = formatDates(obj["POEndDate"])
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorShipto&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + ShipToNumber + '</td>'
                tbleRow += '<td>' + PONumber + '</td>'
                tbleRow += '<td>' + POStartDate + '</td>'
                tbleRow += '<td>' + POEndDate + '</td>'
                tbleRow += '</tr>'
                $('#ShipToTable tbody').append(tbleRow)
            });
        });
}

function showOrders(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorOrders/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Orders'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorOrders&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="OrdersTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product Code</th><th>Quanitity Ordered</th><th>Order Date</th><th>Pack Price</th></tr>'
    $('#OrdersTable thead').append(headers)
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorOrders/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Order Summary'
    card += '</a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="OrderSummaryTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th>Date</th><th>Order Number</th><th>Total</th></tr>'
    $('#OrderSummaryTable thead').append(headers)
    var summary = []
    sprLib.list({ name: 'Subcontractor Orders', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'ProductCode/Title', 'QuantityOrdered', 'OrderDate', 'UnitPackPrice', 'GrandTotalIncludingVAT', 'TrustOrderNumber'],
            queryFilter: '(Subcontractor/Id eq  ' + RecID + ')'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var ProductCode = "&nbsp;"
                if (obj["ProductCode"].Title) {
                    ProductCode = obj["ProductCode"].Title ? obj["ProductCode"].Title : "&nbsp;";
                }
                var QuantityOrdered = obj["QuantityOrdered"] ? obj["QuantityOrdered"] : "&nbsp;";
                var OrderDate = obj["OrderDate"] ? formatDates(obj["OrderDate"]) : "&nbsp;";
                var UnitPackPrice = obj["UnitPackPrice"] ? obj["UnitPackPrice"] : "&nbsp;";
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorOrders&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + ProductCode + '</td>'
                tbleRow += '<td>' + QuantityOrdered + '</td>'
                tbleRow += '<td>' + OrderDate + '</td>'
                tbleRow += '<td>' + parseFloat((UnitPackPrice).toFixed(2)).toLocaleString().replace(/\.([0-9])$/, ".$10") + '</td>'
                tbleRow += '</tr>'
                $('#OrdersTable tbody').append(tbleRow)
                var found = false
                for (i = 0; i < summary.length; i++) {
                    if (summary[i].Date == OrderDate && summary[i].Order == obj["TrustOrderNumber"]) {
                        found = true
                        summary[i].Total = parseFloat(summary[i].Total) + parseFloat(obj["GrandTotalIncludingVAT"])
                    }
                }
                if (!found) {
                    var sumLine = { Date: OrderDate, Order: obj["TrustOrderNumber"], Total: parseFloat(obj["GrandTotalIncludingVAT"]) }
                    summary.push(sumLine)
                }
            });
            console.log(summary)
            for (i = 0; i < summary.length; i++) {
                var tbleRow = '<tr>'
                tbleRow += '<td>' + summary[i].Date + '</td>'
                tbleRow += '<td>' + summary[i].Order + '</td>'
                tbleRow += '<td>' + parseFloat((summary[i].Total).toFixed(2)).toLocaleString().replace(/\.([0-9])$/, ".$10") + '</td>'
                tbleRow += '</tr>'
                $('#OrderSummaryTable tbody').append(tbleRow)
            }
        });
}

function showServices(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #9f95cb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorServices/AllItems.aspx?SubcontractorTitle=' + getParameterByName("SubcontractorTitle") + '&SubcontractorID=' + RecID + '&FilterField1=Subcontractor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Services'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorServices&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ServicesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Speciality</th><th>Service</th><th>Platform</th><th>Description</th></tr>'
    $('#ServicesTable thead').append(headers)
    sprLib.list({ name: 'Subcontractor Services', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'Speciality/Title', 'Service/Title', 'Description'],
            queryFilter: '(Subcontractor/Id eq  ' + RecID + ')'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var Speciality = "&nbsp;"
                if (obj["Speciality"]) {
                    Speciality = obj["Speciality"].Title ? obj["Speciality"].Title : "&nbsp;";
                }
                var Service = "&nbsp;"
                if (obj["Service"].Title) {
                    Service = obj["Service"].Title ? obj["Service"].Title : "&nbsp;";
                }
                var Description = "&nbsp;";
                var ProductDescription = ""
                if (obj["Description"]) {
                    ProductDescription = obj["Description"];
                    Description = obj["Description"];
                    // Description = Description.length > 43 ? Description.substring(0,40)+"..." : Description
                }
                var Platform = "&nbsp;";
                if (obj["Title"]) {
                    Platform = obj["Title"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorServices&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + Speciality + '</td>'
                tbleRow += '<td>' + Service + '</td>'
                tbleRow += '<td>' + Platform + '</td>'
                tbleRow += '<td>' + Description + '</td>'
                tbleRow += '</tr>'
                $('#ServicesTable tbody').append(tbleRow)
            });
        });
}