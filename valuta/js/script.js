'use strict';

window.onload = function () {

  class DOM {
    constructor(root) {
      this.root = root;
    }
    ce(obj) {
      let element = document.createElement(obj.elem);
      if (obj.text != undefined) {
        element.innerHTML = obj.text;
      }
      if (obj.event != undefined) {
        element.addEventListener(obj.event, obj.fn);
      }
      return element;
    }

    render(obj, root) {
      for (let key in root) {
        if (key == "id") {
          root[key].appendChild(obj);
        } else if (key == "className") {
          let cl = document.getElementsByClassName(root[key]);
          for (var i = 0; i < cl.length; i++) {
            let copy = obj;
            cl[i].appendChild(copy);
          }
        }
      }
    }

    clear() {
      document.body.querySelector(this.root).innerHTML = "";
    }
  }


  let arr_code = [145, 292, 298];

  let data = new Date();
  let month = data.getMonth() + 1;
  let year = data.getFullYear();
  let start_data = data.getDate() - 7;
  let end_data = data.getDate() - 1;

  let array_max_min = [];
  let max;
  let min;


  let data1 = `${year}-${month}-${start_data}`;
  let data2 = `${year}-${month}-${end_data}`;
  let table;
  curs();
  function curs(data_start = data1, data_end = data2) {

    let period_dni = data_end.slice(8) - data_start.slice(8) + 2;

    let element = new DOM("#app");
    table = element.ce({
      elem: "table"
    });
    table.className = "table";
    document.body.appendChild(table);
    let trMain = element.ce({
      elem: "tr"
    });
    trMain.id = "trMain";
    table.appendChild(trMain);
    let tdNull = element.ce({
      elem: "td"
    });
    trMain.appendChild(tdNull);
    for (let i = 0; i < arr_code.length; i++) {
      let tr = element.ce({
        elem: "tr"
      });
      table.appendChild(tr);

      // столбец с аббр
      fetch(`https://www.nbrb.by/api/exrates/currencies/${arr_code[i]}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let tdName = element.ce({
            elem: "td",
            text: data.Cur_Abbreviation
          });
          tr.appendChild(tdName);

        })
      fetch(`https://www.nbrb.by/API/ExRates/Rates/Dynamics/${arr_code[i]}?startDate=${data_start}&endDate=${data_end}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          array_max_min.length = 0;
          for (let j = 0; j < data.length; j++) {

            // подпись даты
            if (trMain.children.length !== period_dni) {
              let tdMain = element.ce({
                elem: "td",
                text: data[j].Date.slice(0, 10)
              });
              trMain.appendChild(tdMain);
            }

            let td = element.ce({
              elem: "td",
              text: data[j].Cur_OfficialRate
            });
            tr.appendChild(td);


            // мин макс
            array_max_min.push(data[j].Cur_OfficialRate);

          }

          // min = Math.min(...array_max_min);
          // max = Math.max(...array_max_min);
          max = array_max_min[0];
          min = array_max_min[0];

          for (let i = 0; i < array_max_min.length; i++) {
            if (max < array_max_min[i]) max = array_max_min[i];
            if (min > array_max_min[i]) min = array_max_min[i];
          };

          for (let i = 0; i < tr.children.length; i++) {

            + tr.children[i].innerHTML === max ? tr.children[i].style.color = "red" : null;
            + tr.children[i].innerHTML === min ? tr.children[i].style.color = "green" : null
          }
        });
    }
  }



  searchBut.onclick = function () {

    for (let i = 0; i < table.children.length; i++) {
      for (let j = 0; j < table.children[i].children.length; j++) {
        if (table.children[i].children[j].innerHTML.indexOf(search.value) != -1) {
          table.children[i].children[j].style.background = "pink";
        } else
          table.children[i].children[j].style.background = "none";

      }
    }
  }
  let data1Cal;
  let data2Cal;

  date1.onchange = function () {
    data1Cal = date1.value;

  }
  date2.onchange = function () {
    data2Cal = date2.value;

  }
  showCurs.onclick = function () {
    console.log(table.children);
    table.remove();

    curs(data1Cal, data2Cal);
  }

}
