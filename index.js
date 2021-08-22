let modifiedDataTabel = document.getElementById("modified-data");
let m = 0;
let modifiedData = [];

function printModifiedData() {
  for (let i = 0; i < modifiedData.length; i++) {
    let newLabelNameDiv = document.createElement("div");
    newLabelNameDiv.classList.add("label-name");
    let labelName = modifiedData[i].recordLabelName;
    if (labelName === undefined) {
      labelName = "";
    }

    newLabelNameDiv.innerHTML = `<strong>Record Label</strong> ${labelName}`;
    for (let j = 0; j < modifiedData[i].band.length; j++) {
      let newBandNameDiv = document.createElement("div");
      let newFestivalDiv = document.createElement("div");
      let tempFestivalName = modifiedData[i].band[j].festivalName;
      if (tempFestivalName === undefined) {
        tempFestivalName = "";
      }
      newBandNameDiv.innerHTML = `<strong>Band</strong> ${modifiedData[i].band[j].bandName}`;
      newFestivalDiv.innerText = `${tempFestivalName} Festival`;
      newBandNameDiv.appendChild(newFestivalDiv);
      newLabelNameDiv.appendChild(newBandNameDiv);
    }
    modifiedDataTabel.appendChild(newLabelNameDiv);
  }
}

function compareLabelName(a, b) {
  // for sorting label names
  if (a.recordLabelName < b.recordLabelName) {
    return -1;
  }
  if (a.recordLabelName > b.recordLabelName) {
    return 1;
  }
  return 0;
}
function compareBandName(a, b) {
  // for sorting band names
  if (a.bandName < b.bandName) {
    return -1;
  }
  if (a.bandName > b.bandName) {
    return 1;
  }
  return 0;
}

function findDuplicate(labelName) {
  // checking if duplicate record label is present and also getting the index if it is present
  const index = modifiedData.findIndex(
    (el) => el.recordLabelName === labelName
  );

  return index + 1;
}

function handleData(data) {
  for (let i = 0; i < data.length; i++) {
    let festivalName = data[i].name;
    if (festivalName === undefined) {
      festivalName = "";
    }

    for (let j = 0; j < data[i].bands.length; j++) {
      let labelName = data[i].bands[j].recordLabel;
      if (labelName === undefined) {
        labelName = "";
      }

      let index = findDuplicate(labelName); // check for duplicate record label
      if (m !== 0 && index) {
        // only if we have atleast 1 set of data and we have a duplicate value
        index = index - 1;
        modifiedData[index].band.push({
          bandName: data[i].bands[j].name,
          festivalName: festivalName
        });
        modifiedData[index].band.sort(compareBandName); // sorting after adding a new band
      } else {
        modifiedData[m] = {
          recordLabelName: labelName,
          band: [
            {
              bandName: data[i].bands[j].name,
              festivalName: festivalName
            }
          ]
        };

        m = m + 1;
      }
    }
  }

  modifiedData.sort(compareLabelName); // sorting label names

  printModifiedData(); // printing in the required order
}

fetch(`https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals`)
  .then((data) => data.json())
  .then((res) => handleData(res))
  .catch((error) => console.log(error));
