window.onload = () => {
    const indexMapLookup = [
        "Dalton Building",
        "Business School",
        "Brooks Building"
    ];
    const floorLookup = [
        ["DB-00", "DB-01", "DB-02", "DB-03", "DB-04", "DB-05", "DB-06", "DB-07"],
        ["BS-00", "BS-01", "BS-02", "BS-03", "BS-04", "BS-05", "BS-06", "BS-07"],
        ["BR-00", "BR-01", "BR-02", "BR-03", "BR-04"]
    ];

    let mapSelectOpen = false;
    let floorSelectOpen = false;

    let map;
    let mapnumber;
    let floor;
    let ready = false;

    document.getElementById("logo").addEventListener("click", () =>{
        window.location.replace("../pages/home.html");
    });

    document.getElementById("map-box").addEventListener("click", () =>{
        if (mapSelectOpen){
            mapSelectOpen = false;
            document.getElementById("map-select").style.visibility = "collapse";
        }
        else{
            mapSelectOpen = true;
            document.getElementById("map-select").style.visibility = "visible";
        }
    });
    const mapbuttons = document.getElementsByClassName("map");
    Array.from(mapbuttons).forEach(mapbutton => {
        mapbutton.addEventListener("click", () =>{
            map = mapbutton.textContent;
            document.getElementById("map-select-label").textContent = "Selected: " + map;
            document.getElementById("floor-select-label").textContent = "";
            floor = null;
            ready = false;
            document.getElementById("destination-label").textContent = "";
            floorSelectOpen = false;
            document.getElementById("floor-select").style.visibility = "collapse";
            const but = document.getElementById("go-box").style.visibility = "hidden";
        });
    }); 

    document.getElementById("floor-box").addEventListener("click", () =>{
        if (floorSelectOpen){
            floorSelectOpen = false;
            document.getElementById("floor-select").style.visibility = "collapse";
        }
        else{
            floorSelectOpen = true;
            const floorSelect = document.getElementById("floor-select");
            floorSelect.innerHTML = "";
            const floortab = document.createElement("tr");
            const floorheader = document.createElement("th");
            floorheader.textContent = "Floors";
            floortab.appendChild(floorheader);
            let index = indexMapLookup.indexOf(map);
            if (index == -1){
                document.getElementById("floor-select-label").textContent = "Select a map first!"
            }
            else{
                floorLookup[index].forEach(floorName => {
                    const floorelement = document.createElement("td");
                    floorelement.className = "floor";
                    floorelement.textContent = floorName;
                    floortab.appendChild(floorelement);
                });
                floorSelect.appendChild(floortab);

                const floorbuttons = document.getElementsByClassName("floor");
                Array.from(floorbuttons).forEach(floorbutton => {
                    floorbutton.addEventListener("click", () =>{
                        floor = floorbutton.textContent;
                        document.getElementById("floor-select-label").textContent = "Selected: " + floor;
                        if (map != null && floor !=null){
                            document.getElementById("destination-label").textContent = map + " - " + floor;
                            ready = true;
                            document.getElementById("go-box").style.visibility = "visible";
                        }
                    });
                });
            }

            floorSelect.style.visibility = "visible";
        }
    }); 


    document.getElementById("go-button").addEventListener("click", () => {
        window.location.href = "view.html?building=" + map + "&floor=" + floor;
    });
}
