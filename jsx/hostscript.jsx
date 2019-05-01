/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function openImage(filePath){
    var f = new File(filePath);
    app.open(f);
    var exif = activeDocument.info.exif;
    return JSON.stringify(exif);
}

function close(){
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);//最後にファイルを閉じる
}