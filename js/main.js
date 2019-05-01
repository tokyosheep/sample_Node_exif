/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/


window.onload = function(){
    `use strict`;
    const csInterface = new CSInterface();
    themeManager.init();
    const dir_home = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
    const dir_desktop = require(`path`).join(dir_home, `Desktop`);//デスクトップパス
    const sizeOf = require(`image-size`);//module image-size読み込み
    
    const fromShape = document.getElementById(`fromShape`);
    const fromPS = document.getElementById(`fromPS`);
    const dataFromShape = document.getElementById(`dataFromShape`);
    const exifFromPS = document.getElementById(`exifFromPS`);
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    
    class LoadImage{//データ読み込み用クラス
        constructor(btn,list){
            this.btn = btn;
            this.list = list;
        }
        
        removeList(){//html上のリスト初期化用メソッド
            while(this.list.firstChild){
                this.list.removeChild(this.list.firstChild);
            }
        }
        
        writeData(array){
            array.forEach(v=>{
                const li = document.createElement(`li`);
                li.textContent = v;
                this.list.appendChild(li);
            });
        }
    }
    
    const image_size = new LoadImage(fromShape,dataFromShape);
    image_size.handleEvent = function(){//ファイルパスを読み込んでimage-sizeで縦、横幅取得
        const f = cep.fs.showOpenDialog(false,false,`open`,dir_desktop);
        const dimentions = sizeOf(f.data[0]);
        console.log(dimentions);
        this.removeList();
        this.writeData(Object.entries(dimentions));//取得したオブジェクトをhtml上に表示
    }
    fromShape.addEventListener(`click`,image_size);//ボタンイベント登録
    
    
    const openFromPS = new LoadImage(fromPS,exifFromPS);
    openFromPS.handleEvent = function(){//photoshop用イベント登録
        const f = cep.fs.showOpenDialog(false,false,`open`,dir_desktop);
        if(f.data.length < 1){
            return;
        }
        //photoshopで画像を一度開く
        csInterface.evalScript(`openImage(${JSON.stringify(f.data[0])})`,(o)=>{
            const exif = JSON.parse(o);
            this.removeList();
            exif.forEach(v=>{//取得したexifをhtml上に表示
                const li = document.createElement(`li`);
                v.join(`:`);
                li.textContent = v;
                this.list.appendChild(li);
            });
            csInterface.evalScript(`close()`);//exifを読み込んだ後ドキュメントを閉じる
        });
    }
    fromPS.addEventListener(`click`,openFromPS);
    
    
}
    
