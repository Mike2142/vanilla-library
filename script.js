let userList = [];
class User
{
    constructor()
    {
        this.id = ''
        this.avatar = ''
        this.name = '';
        this.genre = '';
        this.cookie = '';
    }
}

let avatarList =['😀','😁', '😉','😊','😋','😎','🤗','😌', '😇','⭐', '☀','❤','☯', ];
let tempName = '',
    tempGenre = '',
    tempCookie = '';

let editedTableInfo;
let editedID;
let editedBaseInfo;

let pop = document.querySelector('.app__pop');
pop.addEventListener('click', closePop );
let allPopData = document.querySelectorAll('.app__pop-input');

let inputLabel= document.querySelector('.app__user-input-label');
let inputField = document.querySelector('.app__user-input');
inputField.addEventListener('keyup', processInput );
let character =  /\S/ig;

function processInput(event) {
    let inputValue = inputField.value;
    if ( event.key == 'Enter' && inputValue.match(character) ) {
        if (tempName == '' ) {
            tempName = inputField.value;
            inputField.value = '';
            inputLabel.innerHTML = 'любимый жанр';
        } else if ( tempGenre == '' ) {
            tempGenre = inputField.value;
            inputField.value = '';
            inputLabel.innerHTML = 'любите ли вы печеньки?';
        } else {
            tempCookie = inputField.value;
            inputField.value = '';
            registerUser();
        }
    }
}

function getRandomAvatar() {
    let randomNumber =  Math.round(Math.random() * 12);
    let avatar = avatarList[randomNumber];
    return avatar;
}

function registerUser() {

    if ( checkUserLimit() == true ) {

        let newUser = new User();
        newUser.id = tempName + ( Math.random() * 10 );
        newUser.avatar = getRandomAvatar();
        newUser.name = tempName;
        newUser.genre = tempGenre;
        newUser.cookie = tempCookie;

        userList.push(newUser);
        clearUserList();
        renderUserList();
        inputLabel.innerHTML = 'введите имя';
    } else {
        inputLabel.innerHTML = 'извините, &nbsp все столы заняты 😊';
        window.setTimeout( function() { inputLabel.innerHTML = 'введите имя'}, 3500 );
    }
    tempName = tempGenre = tempCookie = '';
}

function checkUserLimit() {
    let tableList = document.querySelectorAll('.app__table-user-info');
    console.log(tableList.length);
    if (tableList.length >= 6) {
        return false
    } else {
        return true
    }
}

function clearUserList() {
    let tableList = document.querySelectorAll('.app__table-user-info');
    tableList.forEach( item => item.remove() );
}

function renderUserList() {
    userList.forEach( item => show(item) );
    function show(item){

        let table = document.querySelector('.app__user-table tbody');
        let userTableRow =  `<tr class="app__table-user-info" valign="top" id ="${item.id}">
                                <td class="app__table-user-data"> ${item.avatar} </td>
                                <td class="app__table-user-data"> ${item.name} </td>
                                <td class="app__table-user-data"> ${item.genre} </td>
                                <td class="app__table-user-data"> ${item.cookie} </td>
                            </tr>`;

        table.insertAdjacentHTML('beforeend', userTableRow);
        window.setTimeout( listenUserInfo, 600 );
    }
}

function listenUserInfo() {

    let allUsers = document.querySelectorAll('.app__table-user-info');
    allUsers.forEach( item => item.addEventListener( 'click', showPop ) );

}

function showPop(event) {
    let clickTarget = event.target;
    editedTableInfo = clickTarget.closest('.app__table-user-info') || clickTarget;
    editedID = editedTableInfo.getAttribute("id");
    editedBaseInfo = userList.find(object => object.id == editedID );
    let allUserData = editedTableInfo.querySelectorAll('.app__table-user-data');
    allUserData.forEach( getUserData );

    window.addEventListener('keyup', changeUserData );
    pop.style.display = 'flex';
}

function closePop(event) {

    if ( event == 'dataChanged' ) {
        window.removeEventListener('keyup', changeUserData );
        pop.style.display = 'none';
    } else {
        let clickTarget = event.target;
        if ( clickTarget.closest('.app__pop-table') || clickTarget.closest('.app__pop-hint') ) {
            return
        } else {
            window.removeEventListener('keyup', changeUserData );
            pop.style.display = 'none';
        }
    }
}

function getUserData(data, index) {
    let tableData = data.innerHTML;
    let popData = allPopData[index];
    popData.value = tableData;
}

function changeUserData(event) {

    if ( event.key == 'Enter' ) {
        let allEditedData = editedTableInfo.querySelectorAll('.app__table-user-data');
        allEditedData.forEach( setTableData );
        setBaseData();
        closePop('dataChanged');
    } else if ( event.key == 'Escape' ) {
        editedTableInfo.remove();
        let editedBaseIndex = userList.findIndex(object => object.id == editedID );
        userList.splice( editedBaseIndex, 1 );
        closePop('dataChanged');
    }

    function setTableData(data, index) {
        let popDataValue = allPopData[index].value;
        if ( popDataValue.match(character) ) {
            data.innerHTML = popDataValue;
        }
    }

    function setBaseData() {
        editedBaseInfo.avatar = allPopData[0].value;
        editedBaseInfo.name = allPopData[1].value;
        editedBaseInfo.genre = allPopData[2].value;
        editedBaseInfo.cookie = allPopData[3].value;
    }
}
