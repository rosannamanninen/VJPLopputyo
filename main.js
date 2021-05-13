
// Retrieving data:



fetch("./data.json").then(response => {
    return response.json();
    
})
.then((data) => {

    
    var output = data.filter(vuosi => vuosi.year==2021);
    console.log(output)
});


//var output =  employees.filter(employee => employee.department == "IT");
//

