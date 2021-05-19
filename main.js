
let testArray = [];

function fetchData() {
    fetch("./data.json").then(response => {
        return response.json();
    })
    .then((data) =>  {
        // console.log(data.artikkelit[0].year)
        // console.log(data.artikkelit.length)
        for (i = 0; i < data.artikkelit.length; i++) {
            testArray.push(data.artikkelit[i].year);
            //console.log(testArray);
        }
        const eriVuodet = [...new Set(testArray)];
        console.log(eriVuodet);
        let str = `<ul>`

        eriVuodet.forEach(function(vuosi) {
            str += `<li>${vuosi}<li>`;
        });
        str += `</ul>`
        document.getElementById("aikajanaLista").innerHTML = str;
    });
}   
fetchData();

