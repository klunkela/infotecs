let table = document.getElementById("table");
let dataJSON // данные из data.json
let data = [] // данные из data.json в формате, необходимом для данной страницы
let data_sorted = [] // отсортированные данные для таблицы
let sorted_value = "value01" // значение по которому сортируем
let page_now = 1 // на какой сейчас странице
const PAGE_SIZE = 10 // сколько строк таблицы на странице
let hidden_columns = [false, false, false, false] // какие из колонок скрыты

// получаем данные, отображаем номера страниц, загружаем данные страницы
async function init() {
    await fetch("data.json")
        .then(res => res.json())
        .then(d => {
            dataJSON = d
            for (let i = 0; i < d.length; i++) {
                data.push({
                    id: d[i].id,
                    firstName: d[i].name.firstName,
                    lastName: d[i].name.lastName,
                    eyeColor: d[i].eyeColor,
                    about: d[i].about
                })
                data_sorted.push({
                    id: d[i].id,
                    firstName: d[i].name.firstName,
                    lastName: d[i].name.lastName,
                    eyeColor: d[i].eyeColor,
                    about: d[i].about
                })
            }
        })

    showPages(data.length / PAGE_SIZE, data_sorted)

    changePage(1)
}

// отображение номеров страниц
function showPages(size) {
    let pages = document.getElementById("pages")

    for (let i = 0; i < size; i++) {
        pages.innerHTML = document.getElementById("pages").innerHTML +
            `<div class="page_text" id="page_${i + 1}">${i + 1}</div>`
    }
    pages.addEventListener("click", function (e) {
        if (e.target && e.path[0].matches("div.page_text")) {
            changePage(e.path[0].id[e.path[0].id.length - 1])
        }
    })
}

// добавляем css для выбранной страницы и загружаем страницу
function changePage(pageNow) {
    setPageNow(pageNow)
    loadPage()
}

// добавляем css для выбранной страницы
function setPageNow(value) {
    try {
        document.getElementById(`page_${page_now}`).classList.remove("active_page")
    } catch (e) {
    }
    document.getElementById(`page_${value}`).classList.add("active_page")
    page_now = value
}

// создание самой таблицы
function loadPage() {
    setTableHeader()

    let data_sliced = data_sorted.slice((page_now - 1) * 10, page_now * 10)
    data_sliced.map(e => {
        let firstName = hidden_columns[0] ? `<td class="col1 hidden_column">${e.firstName}</td>` :
            `<td class="col1">${e.firstName}</td>`
        let lastName = hidden_columns[1] ? `<td class="col2 hidden_column">${e.lastName}</td>` :
            `<td class="col2">${e.lastName}</td>`
        let about = hidden_columns[2] ? `<td class="col3 hidden_column hidden_text">${e.about}</td>` :
            `<td class="col3 hidden_text">${e.about}</td>`
        let eyeColorSpan = `<span style="display: block; width: 10px; height: 10px; background: ${e.eyeColor};"></span>`
        let eyeColor = hidden_columns[3] ? `<td class="col4 hidden_column">${e.eyeColor}${eyeColorSpan}</td>` :
            `<td class="col4">${e.eyeColor}${eyeColorSpan} </td>`

        table.innerHTML = `${table.innerHTML}<tr class="str_data_in_table" 
            id=${e.id}>${firstName}${lastName}${about}${eyeColor}</tr>`
    })

    table.addEventListener("click", function (e) {
        if (e.target && e.path[1].matches("tr.str_data_in_table")) {
            let firstName
            let lastName
            let eyeColor
            let about
            let id
            data_sliced.forEach(dataItem => {
                if (dataItem.id == e.path[1].id) {
                    firstName = dataItem.firstName
                    lastName = dataItem.lastName
                    eyeColor = dataItem.eyeColor
                    about = dataItem.about
                    id = dataItem.id
                }
            })
            document.getElementById(`container_right`).innerHTML =
                `
                    <div>
                        <div>
                            <input type="text" id="change_firstName" value=${firstName}>
                            <input type="text" id="change_lastName" value=${lastName}>
                            <input type="text" id="change_eyeColor" value=${eyeColor}>
                            <textarea id="change_about" oninput="autoGrowAboutTextarea(this)">${about}</textarea>  
                        </div>
                        <button onclick="changeData('${id}')">Редактировать</button>
                        <button onclick="cancelChanging()">Отмена</button>
                    </div>
                `

            autoGrowAboutTextarea(document.getElementById("change_about"))
        }
    });
}

// устанавливаем названия колонок
function setTableHeader() {
    let firstName = hidden_columns[0] ? `` : `<th class="col1">Имя</th>`
    let lastName = hidden_columns[1] ? `` : `<th class="col2">Фамилия</th>`
    let about = hidden_columns[2] ? `` : `<th class="col3">Описание</th>`
    let eyeColor = hidden_columns[3] ? `` : `<th class="col4">Цвет глаз</th>`
    table.innerHTML =
        `
            <tr id="table_header">
                ${firstName}
                ${lastName}
                ${about}
                ${eyeColor}
            </tr>
        `
}

// для автоизменения размера textarea
function autoGrowAboutTextarea(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight+5) + "px";
}

// при отмене редактирования строки - удаляем содержимое container_right
function cancelChanging() {
    document.getElementById("container_right").innerHTML = ""
}

// при сохранении введенных данных строки - меняем dataJSON ("отправляем на сервер"), обновляем переменные
// и перезагружаем содержимое таблицы
function changeData(id) {
    let firstName = document.getElementById("change_firstName").value;
    let lastName = document.getElementById("change_lastName").value;
    let about = document.getElementById("change_about").value;
    let eyeColor = document.getElementById("change_eyeColor").value;

    dataJSON.forEach(e => {
        if (e.id == id) {
            e.name.firstName = firstName
            e.name.lastName = lastName
            e.about = about
            e.eyeColor = eyeColor
        }
    })

    ///////////////////// write dataJSON to data.json ////////////////////////

    data = []
    for (let i = 0; i < dataJSON.length; i++) {
        data.push({
            id: dataJSON[i].id,
            firstName: dataJSON[i].name.firstName,
            lastName: dataJSON[i].name.lastName,
            eyeColor: dataJSON[i].eyeColor,
            about: dataJSON[i].about
        })
    }

    data_sorted = copyData()
    sortData(true)
    loadPage()
}

// копирование объекта data
function copyData() {
    let result = []
    for (let i = 0; i < data.length; i++) {
        result.push({
            id: data[i].id,
            firstName: data[i].firstName,
            lastName: data[i].lastName,
            eyeColor: data[i].eyeColor,
            about: data[i].about
        })
    }
    return result
}

// при скрытии/развертывании колонок - добавляем/удаляем стили, добавляем/удаляем возможность выбора сортировки
// по соответствующим параметрам
function toggling(column_number, elements) {
    let num1 = (column_number + 1) * 2
    let num2 = (column_number + 1) * 2 + 1
    if (!hidden_columns[column_number]) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add("hidden_column")
        }
        hidden_columns[column_number] = true
        let num = Number(sorted_value.substring(5))
        if (num == num1 || num == num2) {
            document.getElementById(`sortData`).value = "value01"
            sortData()
        }

        document.getElementById(`sortData`).options[num1-1].disabled = true;
        document.getElementById(`sortData`).options[num2-1].disabled = true;
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("hidden_column")
        }
        hidden_columns[column_number] = false

        document.getElementById(`sortData`).options[num1-1].disabled = false;
        document.getElementById(`sortData`).options[num2-1].disabled = false;
        loadPage()
    }

}

// функции-обработчики инпутов
function toggleFirstName() {
    let col_elements = document.getElementsByClassName("col1")
    toggling(0, col_elements)
}

function toggleLastName() {
    let col_elements = document.getElementsByClassName("col2")
    toggling(1, col_elements)
}

function toggleAbout() {
    let col_elements = document.getElementsByClassName("col3")
    toggling(2, col_elements)
}

function toggleEyeColor() {
    let col_elements = document.getElementsByClassName("col4")
    toggling(3, col_elements)
}

// обработчик селекта, сортируем data
function sortData(save_page_now) {
    let sel = document.getElementById('sortData').selectedIndex;
    let options = document.getElementById('sortData').options;
    sorted_value = options[sel].value

    switch (sorted_value) {
        case 'value01': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            loadPage()

            break
        }
        case 'value02': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
            loadPage()

            break
        }

        case 'value03': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => b.firstName.localeCompare(a.firstName));
            loadPage()

            break
        }

        case 'value04': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => a.lastName.localeCompare(b.lastName));
            loadPage()

            break
        }

        case 'value05': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => b.lastName.localeCompare(a.lastName));
            loadPage()

            break
        }

        case 'value06': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => a.about.localeCompare(b.about));
            loadPage()

            break
        }

        case 'value07': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => b.about.localeCompare(a.about));
            loadPage()

            break
        }

        case 'value08': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => a.eyeColor.localeCompare(b.eyeColor));
            loadPage()

            break
        }

        case 'value09': {
            data_sorted = copyData()
            if (!save_page_now) setPageNow(1)
            data_sorted.sort((a, b) => b.eyeColor.localeCompare(a.eyeColor));
            loadPage()

            break
        }

        default: {
        }
    }

}

init()

