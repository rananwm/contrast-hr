let jsonFields = [];
// get the list of inputs, radio buttons and selects in the form

let list = document.querySelectorAll('#form_skills input[type="text"], #form_skills textarea, #form_skills input[type="radio"], #form_skills select')
for (var i = 0; i < list.length; i++) {
    let input = list[i];
    // get the parent element
    let parent = input.parentElement;

    let labelText = parent.innerText;
    let inputId = input.getAttribute('name');
    let inputType = input.getAttribute('type');

    // convert the above into a json object
    let json = {
        "id": inputId,
        "type": inputType,
        "label": labelText,
        "options": []
    }
    jsonFields.push(json);
}
JSON.stringify(jsonFields);