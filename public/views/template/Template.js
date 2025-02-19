$(afterLoading);
function afterLoading(){
    setupSchools();
}
// School Names and courses offered by the schools are hardcoded
function setupSchools(){
    // Clear cardContainer
    $('.cardContainer').empty();

    // Change heading to subjects
    $('#branchLists h3').text('Schools')

    // Stores hardcoded schools names and degrees offered by each school and their ID
    let schools = getSchoolList();

    //Propagates all school templates
    schools.forEach(function(item){
        let template = new BranchTemplate(item);
        template.propagateTemplate();
        // BranchTemplateArr.push(template);
    });

    // Set on click listener for each degree/branch
    branchOnClick();
}

function branchOnClick(){
    // If someone selects the branch clear cardContainer div
    // and add semseter wise subject list in the div
    $('.cardContainer p').click(async function(){
        branchID = $(this).find('input').val();
        var branchName = $(this).text();
        console.log(branchName);
        // Clear cardContainer
        $('.cardContainer').empty();

        // Change heading to subjects
        $('#branchLists h3').text(branchName);


        // Create a button to return to previous page
        let prevButton = $('<button>');
        let icon = $('<img>');
        icon.attr('src', 'views/Images/btnReturn.png')
        // prevButton.text('Return');
        prevButton.append(icon);

        prevButton.addClass('btnReturn')
        prevButton.click(function(){
            setupSchools();
            $(this).remove();
        });

        $('.cardContainer').before(prevButton);

        // Call Controller to get subject list for that branch
        // Expected format
        // jsArray = [subject_1, subject_2, ...]
        // subject_1 = {
        //      subjectName = ,
        //      subjectCode = , (subjectCode will act as subjectID)
        //      Any other Info
        // };

        subjectArr = await getSubjectsByBranch(branchID.toUpperCase());

        // Propagate subjects
        let subjectTemp = new SubjectTemplate(subjectArr);
        subjectTemp.propagateTemplate();

        $('.cardContainer p').click(function() {
            let subjectCode = $(this).find('span').text();
            console.log(subjectCode);
        });
    });
}

// This class takes data from jSon or arrays and
// populates template present in the current page with the received data
class BranchTemplate{
    constructor(dataObj){
        this.tHeading = dataObj.name;
        this.tData = dataObj.tData;
        this.tSearchID = dataObj.tSearchID;
    }
    propagateTemplate(){
        if ('content' in document.createElement('template')) {
            let template = $('#schoolTemplate');
            let container = $('.cardContainer');

            let clone = template.prop('content');

            // Set Heading
            let tHeading = $(clone).find('h3');
            tHeading.text(this.tHeading);

            // Fill data in lists
            this.fillData($(clone).find('.links'));

            // Inserts template to the web page
            container.append(template.html());

            //Reset template
            $(clone).find('h3').empty();
            $(clone).find('.links').empty();
         }
         else {
            // the HTML template element is not supported.
            alert("HTML template element is not supported.")
        }
    }

    // Method that adds degrees/branchs in the school template
    fillData(cardContent){
        let L = this.tData.length, i = 0, pTag, ipTag;
        if(this.tData.length !== this.tSearchID.length){
            // Only for testing
            console.log('Unequal tData and tSearchID array!');
        }
        for(i = 0; i < L; i++){
            pTag = $('<p>');
            pTag.text(this.tData[i]);
            ipTag = $('<input>');
            ipTag.attr('type', 'hidden');
            ipTag.val(this.tSearchID[i]);
            pTag.append(ipTag);
            cardContent.append(pTag);
        }
    }
}

// Does similar work
// Used to propagate subjects for given branch
class SubjectTemplate{
    constructor(subArray){
        this.subArray = subArray;
    }
    propagateTemplate(){
        if ('content' in document.createElement('template')) {
            let template = $('#branchTemplate');
            let container = $('.cardContainer');

            // Makes seperate templates for each of the semester
              let clone = template.prop('content');

              // Sets heading
              let subHeading = $(clone).find('h3');
              subHeading.text('Subjects');

              // Fills the semester-i's template with the courses
              this.fillSubjects($(clone).find('.links'), this.subArray);
              container.append(template.html());

              //Reset template
              $(clone).find('h3').empty();
              $(clone).find('.links').empty();
         }
         else {
            // the HTML template element is not supported.
            alert("HTML template element is not supported.")
        }
    }
    fillSubjects(subjectListDiv, data){
        let L = data.length, i = 0, aTag, pTag;
        for(i = 0; i < L; i++){
            aTag = $('<a>');
            aTag.text(data[i].subjectName + ' ' + data[i].subjectCode);
            // Uses subject code to identify the subject
            aTag.attr('href', 'SubjectTemplate.html?subCode=' + data[i].subjectCode);
            subjectListDiv.append(aTag);
        }
    }
}

function getSchoolList(){
  return [{
      name: 'SBS',
      tData: ['Physics', 'Chemistry', 'Maths'],
      tSearchID: ['PH', 'CH', 'MA']
  },{
      name: 'SEOCS',
      tData: ['All Courses'], //Suggest degrees offered by SEOCS
      tSearchID: ['OC'] // suggest an appropriate code for SEOCS
  },{
      name: 'SES',
      tData: ['Computer Science and Engineering', 'Electronics and Communication Engineering', 'Electrical Engineering'],
      tSearchID: ['CS', 'EC', 'EE']
  },{
      name: 'SHSS&M', //Suggest degrees offered by SHSS&M
      tData: ['All Courses'],
      tSearchID: ['HS'],
  },{
      name: 'SIF',
      tData: ['Civil Engineering'],
      tSearchID: ['CE'],
  },{
      name: 'SMS',
      tData: ['Mechanical Engineering'],
      tSearchID: ['ME'],
  },{
      name: 'SMMME',
      tData: ['Metallurgical and Materials Engineering'],
      tSearchID: ['MM'],
  },{
      name: 'Others',
      tData: ['IDT Courses'], //Suggest a proper name for IDT Courses
      tSearchID: ['ID'] //Suggest proper code
  }];
}
