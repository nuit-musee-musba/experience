
function updateDescriptionElements(data){
    let title = document.getElementById("title")
    let desc = document.getElementById('description')

    title.innerHTML = data['desc_title']
    desc.innerHTML = data['desc_content']

}

function loadLocalJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', '../../../data/item_descriptions.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

function search(data, id) {
    var dataTarget = data[id][0];
    return dataTarget;
}

function getElementInformations(id) {
    return new Promise(function (resolve, reject) {
        loadLocalJSON(function (jsonData) {
            var searchedData = search(jsonData, id);

            if (searchedData) {
                resolve(searchedData);
            } else {
                reject('not found');
            }
        });
    });
}

getElementInformations("1")
    .then(result => updateDescriptionElements(result))
    .catch(error => console.log(error));

