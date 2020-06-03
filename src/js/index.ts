import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface IMusic {
    id : Number;
    title : String;
    artist : String;
    album : String;
    recordLabel : String;
    durationInSeconds: Number;
    yearOfPublication: Number;
}

// let baseUri: string ="https://restmusicserviceoo.azurewebsites.net/api/music"
let baseUri: string ="http://drmusiccollectionoo.azurewebsites.net/api/music"
let outputElement : HTMLDivElement= <HTMLDivElement> document.getElementById("output");
let buttonElement : HTMLButtonElement = <HTMLButtonElement> document.getElementById("getAllButton");
let addRecordElement : HTMLButtonElement = <HTMLButtonElement> document.getElementById("addButton");
let deleteRecordElement : HTMLButtonElement = <HTMLButtonElement> document.getElementById("deleteButton");

buttonElement.addEventListener("click",ShowRecords);
addRecordElement.addEventListener("click",addRecord);
deleteRecordElement.addEventListener("click",deleteRecord);




function ShowRecords(): void {
    axios.get<IMusic[]>(baseUri)
    .then(function(response: AxiosResponse<IMusic[]>): void {
        let langHTML = json2table(response.data)
        console.log(langHTML);
        outputElement.innerHTML = langHTML;

    })

    .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
        if (error.response) {
            // the request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
            outputElement.innerHTML = error.message;
        } else { // something went wrong in the .then block?
            outputElement.innerHTML = error.message;
        }
    });
}

export function json2table(json: any): string {
    let cols: string[] = Object.keys(json[0]);
    let headerRow: string = "";
    let bodyRows: string = "";
    cols.forEach((colName: string) => {
        headerRow += "<th>" + capitalizeFirstLetter(colName) + "</th>"
    });
    json.forEach((row: any) => {
        bodyRows += "<tr>";
        // loop over object properties and create cells
        cols.forEach((colName: string) => {
            bodyRows += "<td>" + (typeof row[colName] === "object" ? JSON.stringify(row[colName]) : row[colName]) + "</td>";
        });
        bodyRows += "</tr>";
    });
    return "<table><thead><tr>" +
        headerRow +
        "</tr></thead><tbody id='MusicList' style='margin-left: 100px;'>" +
        bodyRows +
        "</tbody></table>";
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);

}

function addRecord(): void {
    let addIdElement: HTMLInputElement = <HTMLInputElement> document.getElementById("addId")
    let addTitleElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addTitle");
    let addArtistElement: HTMLInputElement = <HTMLInputElement> document.getElementById("addArtist")
    let addAlbumElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addAlbum");
    let addRecordLabelElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addRecordLabel");
    let addDurationInSecondsElement: HTMLInputElement = <HTMLInputElement> document.getElementById("addDurationInSeconds");
    let addYearOfPublicationElement: HTMLInputElement = <HTMLInputElement> document.getElementById("addYearOfPublication");
    
    let myID: number = Number(addIdElement.value);
    let myTitel: string = addTitleElement.value;
    let myArtist: string = addArtistElement.value;
    let myAlbum: string = addAlbumElement.value;
    let myRecordLabel: string = addRecordLabelElement.value;
    let myDurationInSeconds: number = Number(addDurationInSecondsElement.value);
    let myaddYearOfPublication: number = Number(addYearOfPublicationElement.value); 

    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("addRecordDiv");
    // id is generated by the back-end (REST service)
    
    axios.post<IMusic>(baseUri, { id: myID, title: myTitel, artist: myArtist, album: myAlbum, recordLabel: myRecordLabel, durationInSeconds: myDurationInSeconds, yearOfPublication: myaddYearOfPublication  })
        .then((response: AxiosResponse) => {
            // let message: string = "response " + response.status + " " + response.statusText;
            let message: string = "Record has been added! Refresh to see."
            output.innerHTML = message;
        })
        .catch((error: AxiosError) => {
            // output.innerHTML = error.message;
            let messageFail: string = "Adding of record failed..."
            output.innerHTML = messageFail;
        });
}

function deleteRecord(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.delete<IMusic>(uri)
        .then(function (response: AxiosResponse<IMusic>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            let message: string = "Record has been deleted! Refresh to see."
            output.innerHTML = message;
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                output.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                output.innerHTML = error.message;
            }
        });
}