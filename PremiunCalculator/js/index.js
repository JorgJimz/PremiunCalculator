const url = "https://localhost:7182/api/Premium";

document.addEventListener('change', function (evt) {
    if (evt.target && evt.target.className == 'period') {
        Calcular(evt);
    }
});

document.addEventListener('submit', function (event) {
    if (event.target.id != 'fPremium') return;
    event.preventDefault();
    ObtenerPremium();
}, false);

const Calcular = (element) => {
    try {
        var dataMonthly = parseFloat(element.target.options[event.target.selectedIndex].dataset.monthly);
        var dataAnnually = parseFloat(element.target.options[event.target.selectedIndex].dataset.annually);
        var premiumValue = parseFloat(element.target.parentElement.closest('tr').querySelector('td:nth-child(3) input').value);
        element.target.parentElement.closest('tr').querySelector('td:nth-child(4) input').value = (premiumValue * dataAnnually).toFixed(2);
        element.target.parentElement.closest('tr').querySelector('td:nth-child(5) input').value = (premiumValue / dataMonthly).toFixed(2);
    }
    catch (error) {
        alert('Error: ' + error);
    }
}

const CalcularEdad = (elm) => {
    var hoy = new Date();
    var cumpleanos = new Date(elm.value);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    document.getElementById('age').value = edad;
}

const ObtenerPremium = async () => {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            dateOfBirth: document.getElementById('birthdate').value,
            state: document.getElementById('state').value,
            age: document.getElementById('age').value,
            plan: document.getElementById('plan').value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    }).then(function (data) {
        if (data.length > 0) {
            var t = document.getElementById("premiun_table").tBodies[0];
            t.innerHTML = '';
            var selectElm = "<select class='period'>" +
                "<option>[Choose Here]</option>" +
                "<option data-monthly='1' data-annually='12'>Monthly</option>" +
                "<option data-monthly='3' data-annually='4'>Quarterly</option>" +
                "<option data-monthly='6' data-annually='2'>Semi-Anually</option>" +
                "<option data-monthly='12' data-annually='1'>Annually</option>" +
                "</select>";
            data.forEach(function (v, k) {
                var html = '';
                var item = document.createElement("tr");
                html += `<td>${selectElm}</td>`;
                html += `<td><input id='txtCarrier' value='${v.carrier}' readonly='readonly' /></td>`;
                html += `<td><input id='txtPremiun' value='${v.premium}' readonly='readonly' /></td>`;
                html += `<td><input id='txtAnnual' readonly='readonly' /></td>`;
                html += `<td><input id='txtMonthly' readonly='readonly' /></td>`;
                item.innerHTML = html;
                t.append(item);
            });
        }
        else {
            alert("No records.");
        }
    }).catch(function (error) {
        alert('Error: ' + error);
    });
}
