let jsonFields = [];
let list = document.querySelectorAll('#form_skills>.row')
for (var i = 0; i < list.length; i++) {
    // get the first label in the column
    let labelText = ""
    let label = list[i].querySelector('label');
    if (label) {
        labelText = label.innerText;
    } else {
        // if there is no label, then skip this column
        continue;
    }
    // get the second label in the column
    let subLabelText = "";
    let subLabel = list[i].querySelectorAll('label')[1];
    if (subLabel) {
       subLabelText = subLabel.innerText;
    }

    // get the input in the column
    let input = list[i].querySelector('input');
    // get the input type
    let inputType = input.getAttribute('type');
    // get the input id
    let inputId = input.getAttribute('id');

    // convert the above into a json object
    let json = {
        "id": inputId,
        "type": inputType,
        "label": labelText,
        "prompt": subLabelText,
        "options": []
    }
    jsonFields.push(json);
}
JSON.stringify(jsonFields);