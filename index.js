const fs = require('fs');
const parse = require('xml-parser');
var xml = fs.readFileSync('unt4.xml','utf-8');
var obj = parse(xml);

//Array of alternating <tr role="row" class="odd parent"> and  <tr class="child">
let trArray = Array.from(obj.root.children);

num = 0;
trArray.forEach(element => {
    //Get all table rows that contain separated payment info for each payment period
    var myChildElement = (element.name=='tr' && element.attributes.class=='child') ? element.children[0] : null;
    if(myChildElement) { num = num + 1; console.log(extractSeparatedPaymentInfo(myChildElement, num)) };
    
});

function extractSeparatedPaymentInfo(childElement, printThisNumber){

    var payPeriod = { period: printThisNumber, data: [] };

    //Get the <ui> element that contains separated payment info
    var ulElement = (childElement && childElement.attributes.class=='child' && childElement.attributes.colspan=='8') ? childElement.children[0] : null;

    //This gets the <li> under the <ui> element that contains the separated payment info
    var liElement = ulElement!=null ? ulElement.children[0].children[1] : null;

    //This gets the <div class="loan-container"> element under the <li> element that contain the separated payment info
    var loanContainerElements = (liElement.attributes.class=='data' && liElement.children[0].attributes.class=='loan-container') ? liElement.children : null;
    
    loanContainerElements.forEach(element => {
        var loanContainerInfo = {
            tokenName : '',
            loanBody : []
        };
        loanContainerInfo.tokenName  = element.children[0].children[1].content;
        loanContainerInfo.loanBody = Array.from(extractLoanContainerInfo(element));
        payPeriod.data.push(loanContainerInfo);
    });

    return payPeriod;
}

function extractLoanContainerInfo(loanContainerElement){
    var loanContainerUlData = loanContainerElement.children[1].children[0];

    var loanBody = [];

    //This extracts all the content from each separated loan payment
    loanContainerUlData.children.forEach(element => {

        var loanBodyInfo = { header: '', data: ''}

        // Title of loan body
        loanBodyInfo.header = element.children[0].content;
        loanBodyInfo.data = element.children[1].content;
        loanBody.push(loanBodyInfo);
    });

    return loanBody;
}

//For testing purposes according to file unt4.xml
// console.log('CORRECT trArray: '+trArray.length); //26
// console.log('CORRECT myChildElementArray: '+myChildElementArray.length); //13
// console.log('CORRECT ulElementArray: '+ulElementArray.length); //13
// console.log('CORRECT liElementChildrenArray: ',liElementChildrenArray.length); //26
// console.log('CORRECT loanContainerArray: ',loanContainerArray.length); //91 for unt4.xml

