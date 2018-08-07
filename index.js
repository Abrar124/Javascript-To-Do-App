var database = firebase.database().ref('/')
var input = document.getElementById('demo');
var list = document.getElementById('list');

function add() {
    if (input.value === "") {
        alert('Enter something');
    }
    else {
        var user = {
            name: input.value,
        }
        database.child('todo').push(user);
        input.value = "";
    }
}

database.child('todo').on('child_added', function (snapshot) {
    var obj = snapshot.val();
    obj.id = snapshot.key;
    render(obj);
})

function render(user) {
    var li = document.createElement('LI');
    var textNode = document.createTextNode(user.name);
    li.appendChild(textNode);
    li.setAttribute("id", user.id);
    li.setAttribute('class', 'list-group-item active myclass');
    li.setAttribute('style', 'background-color:rgba(0,0,0,0.5);color:white;border:none;padding:2.2%')

    var delBtn = document.createElement('BUTTON');
    var delTxt = document.createTextNode('Delete');
    delBtn.appendChild(delTxt);
    delBtn.setAttribute('class', 'btn btn-danger float-right');
    delBtn.setAttribute('style', 'margin-left:2%');
    delBtn.onclick = function () {
        removeLi(user.id);
    }

    var editBtn = document.createElement('BUTTON');
    var editTxt = document.createTextNode('Edit');
    editBtn.appendChild(editTxt);
    editBtn.setAttribute('class', 'btn btn-primary float-right');
    editBtn.onclick = function () {
        editOne(user.id);
    }
    li.appendChild(delBtn);
    li.appendChild(editBtn);
    list.appendChild(li);
}

function removeLi(key) {
    database.child('todo/'+ key).remove();
}

database.child("todo").on('child_removed', function (data) {
    var deletedLi = document.getElementById(data.key);
    deletedLi.remove();
})

function editOne(key) {
    var myElement = document.getElementById(key);
    var myvalue = myElement.childNodes[0].wholeText;
    var inputfield = document.createElement('INPUT');
    inputfield.setAttribute('type', 'text');
    inputfield.setAttribute('id', key + 'omar');
    inputfield.setAttribute('value', myvalue);
    inputfield.setAttribute('style', 'background-color:rgba(0,0,0,0.5);color:white;padding:1%');

    myElement.childNodes[0].remove();
    var x = myElement.childNodes[0];
    myElement.insertBefore(inputfield, x);
    document.getElementById(key + 'omar').focus();

    var againElement = document.getElementById(key);
    var againValue = againElement.childNodes[2];
    againValue.childNodes[0].data = 'Update';
    againValue.onclick = function () {
        updateOne(key);
    }
}

function updateOne(key) {
    var myVal = document.getElementById(key + 'omar').value;
    if (myVal === "") {
        alert('Type Something');
    }
    else {
        database.child('todo/' + key).set({
            name: myVal,
        })
    }
}

database.child("todo").on('child_changed', function (data) {
    var updatedLi = document.getElementById(data.key + 'omar');
    var newVal = updatedLi.value;
    var s = updatedLi.parentNode;
    var childRemoved = s.childNodes[0];
    childRemoved.remove();
    var x = s.childNodes[0];
    var bla = document.createTextNode(newVal);
    s.insertBefore(bla, x);
    s.childNodes[2].innerText = 'Edit';
    s.childNodes[2].onclick = function () {
        editOne(user.id);
    }
})

function deleteAll() {
    database.child('todo').remove();
}