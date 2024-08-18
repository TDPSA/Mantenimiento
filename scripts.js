function format_date(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });
    return formattedDate;
}
function format_cell_color(
    td, days, aviso, vencido
) {
    if (days < aviso) {
        td.classList.add('color-celda-ok');
    } else if (days < vencido) {
        td.classList.add('color-celda-aviso');
    } else {
        td.classList.add('color-celda-vencido');
    }
}
function main() {
    const AS_URL_BASE = "https://script.google.com/macros/s/AKfycbzYnwhOjnInoNvp8W-OrfyTqxdEDJi7k5gDiTQxPgev-W-bOyrLUzVLC-UVuB_eHDT00w/exec";
    var url = document.location.href;
    var k = url.substr(url.lastIndexOf("k=")+2);
    let unit = document.getElementById('unit');
    unit.textContent = "Unidad: " + k.replace(/%20/g, " ");
    if(k){
        fetch(AS_URL_BASE+'?k='+k)
        .then(response => response.text())
        .then(data => {
            let items = data.split(",");
            let table = document.getElementById('dataTable');
            let rows = [
                ["Último engrase", items[0]],
                ["Días sin engrase", items[1]],
                ["Última VTV", items[2]],
                ["Días restantes VTV", items[3]],
                ["Última Certificación", items[4]],
                ["Días restantes Certificación", items[5]]
            ];
            rows.forEach((row, index) => {
                let tr = document.createElement('tr');
                row.forEach((cell, col) => {
                    let td = document.createElement('td');
                    if (col === 1) {
                        if (cell === "-" || cell === "Sin Registro") {
                            td.classList.add('color-nodata');
                        } else if (index % 2 === 0) {
                            var cell = format_date(cell)
                        } else {
                            if (index === 1) {
                                format_cell_color(td, parseInt(cell), 23, 30);
                            } else if (index === 3 || index === 5) {
                                format_cell_color(td, -parseInt(cell), -30, 0);
                            }
                        }
                    }
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
            table.style.display = 'table';
            document.querySelector('.lds-ring').style.display = 'none';
        })
    }
}

window.addEventListener("load", main);