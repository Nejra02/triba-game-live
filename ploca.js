// ovdje cuvamo koordinate krugova
let lista = [];
let igraPrvi = true;
let igraPrviNeMijenjaSeDoKraja = true;

// linija 1
const line = document.getElementById("linija");
const ctx = line.getContext("2d");
// linija 2
const line1 = document.getElementById("linija1");
const ctx1 = line1.getContext("2d");

postaviPocetneLinije();

const krugovi = document.getElementById("ploca");
const ctx2 = krugovi.getContext("2d");

const radius = 25, gap = 20;
let cols = 0, rows = 0;

function postaviPlocu(a,b){
    cols=a;
    rows=b;
    // kreiramo listu i crtamo pocetne krugove
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (2 * radius + gap) + radius + gap;
            const y = row * (2 * radius + gap) + radius + gap;
            lista.push({x, y, radius, color: 'grey'});
            nacrtajKrug(ctx2, x, y, radius, 'grey');
        }
    }
}

// posto ce specijalna ploca biti u obliku N slova, potrebno je da krugovi budu samo kada je x=45, x= 395 i x = y
function postaviSpecijalnuPlocu(a) {
    const cols = a;
    const rows = a;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (2 * radius + gap) + radius + gap;
            const y = row * (2 * radius + gap) + radius + gap;
            if (x === 45 || x === 395 || x === y) {
                lista.push({ x, y, radius, color: 'grey' });
                nacrtajKrug(ctx2, x, y, radius, 'grey');
            }
        }
    }
}

function promijeniIgraca() {
    igraPrvi = !igraPrvi;
}

function postaviPocetneLinije() {
    if (igraPrviNeMijenjaSeDoKraja) {
        ctx.strokeStyle = "white";
        ctx1.strokeStyle = "white";
    } else {
        ctx.strokeStyle = "black";
        ctx1.strokeStyle = "black";
    }
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(25, 50);
    ctx.lineTo(25, 450);
    ctx.stroke();

    ctx1.lineWidth = 10;
    ctx1.beginPath();
    ctx1.moveTo(25, 50);
    ctx1.lineTo(25, 450);
    ctx1.stroke();
}

function postaviLinije() {
    if (igraPrvi) {
        ctx.strokeStyle = "white";
        ctx1.strokeStyle = "white";
    } else {
        ctx.strokeStyle = "black";
        ctx1.strokeStyle = "black";
    }
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(25, 50);
    ctx.lineTo(25, 450);
    ctx.stroke();

    ctx1.lineWidth = 10;
    ctx1.beginPath();
    ctx1.moveTo(25, 50);
    ctx1.lineTo(25, 450);
    ctx1.stroke();
}


function nacrtajKrug(ctx, x, y, radius, color) {
    ctx.beginPath(); 
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function povuciLiniju(krug1, krug2){
    if (igraPrvi) {
        ctx2.strokeStyle = "white";
    } else {
        ctx2.strokeStyle = "black";
    }
    ctx2.lineWidth = 4;
    ctx2.beginPath();
    ctx2.moveTo(krug1.x, krug1.y);
    ctx2.lineTo(krug2.x, krug2.y);
    ctx2.stroke();
}

let trokut = [];
let listalinija = [];
let brojac=0;

/* Uslovi da trokut bude ispravan : 
    1. ne moze se staviti tacka na vec postojecu tacku
    2. ne moze biti 3 tacke na istoj pravoj ( horzizontalno, vertikalno i po dijagonali )
    3. ukoliko je unutar nekog trougla - da li sijece neku prethodnu liniju ili sijece neki krug
*/


// dodajemo event listener za klik na canvas
krugovi.addEventListener('click', function(event) {
    // tacke X i Y gdje je korisnik kliknuo, ali offSet sluzi da da koordinate klika u odnosu na trenutni element u kojem se dogadjaj desio, u ovom slucaju u odnosu na CANVAS
    const xklik = event.offsetX;
    const yklik = event.offsetY;
    //console.log("Klikovi: ",xklik, yklik);

    for (let i = 0; i < lista.length; i++) {
        let krug = lista[i];
        // udaljenost između 2 tacke formula
        const udaljenost = Math.sqrt((xklik - krug.x) ** 2 + (yklik - krug.y) ** 2);
        if (udaljenost <= krug.radius*4 && udaljenost >= krug.radius*2) {
            const validan = provjeriKlik(krug);
            //console.log('unutar kruga');
            // potencijalna buduca linija za koju provjeravamo jel se sijece se vec postojecim linijama
            let novalinija = [trokut[brojac-1],krug];
            let sijecese = false;
            // provjeravamo jel sijece krug odnosno trokut
            let sijeceKrug = false;

            if(brojac >= 1 && listalinija.length!=0){
                sijecese = provjeriPresjek(novalinija, listalinija);
                sijeceKrug = prolaziKrozKrug(novalinija);
            }
            console.log("Krug: ",krug.x, krug.y);
            if(validan && !sijecese && !sijeceKrug){
                if(igraPrvi){
                    nacrtajKrug(ctx2, krug.x, krug.y, krug.radius, 'white');
                    krug.color = 'white';
                    krug.blocked = true;
                }
                else{
                    nacrtajKrug(ctx2, krug.x, krug.y, krug.radius, 'black');
                    krug.color = 'black';
                    krug.blocked = true;
                }
                trokut.push(krug);
                brojac++;
                //console.log('Brojac: ',brojac);
                // ako sijece neki krug ili neku liniju 1 i 3 krug, svejedno ce povuci liniju izmedju 1 i 2, ovaj dio osigurava da ne radi to
                let sijeceKrug = false;
                let sijecese = false;
                if(brojac === 3){
                    novalinija = [trokut[2],trokut[0]];
                    sijecese = provjeriPresjek(novalinija, listalinija);
                    sijeceKrug = prolaziKrozKrug(novalinija);
                }
                if(brojac >= 2 && !sijecese && !sijeceKrug){
                    //blokirajDijagonalu(trokut[brojac-2],trokut[brojac-1]);
                    //blokirajKrugove(trokut[brojac-2],trokut[brojac-1]);
                    povuciLiniju(trokut[brojac-2],trokut[brojac-1]);
                    blokirajPresjeceneKrugove([trokut[brojac-2],trokut[brojac-1]]);
                    listalinija.push([trokut[brojac-2],trokut[brojac-1]]);
                    provjeriKraj();
                }
            }
            else{
                alert('Krug nije validan, označite ponovo!');
            }
            break;
        }
    }
    // da resetuje varijable i povuce finalnu liniju izmedju 1 i 3 kruga
    if(brojac === 3){
        //blokirajKrugove(trokut[0],trokut[2]);
        //blokirajDijagonalu(trokut[0],trokut[2]);
        novalinija = [trokut[2],trokut[0]];
        sijecese = provjeriPresjek(novalinija, listalinija);
        sijeceKrug = prolaziKrozKrug(novalinija);
        if(!sijecese && !sijeceKrug){
            povuciLiniju(trokut[2],trokut[0]);
            blokirajPresjeceneKrugove(novalinija);
            listalinija.push([trokut[2],trokut[0]]);
            trokut = [];
            brojac=0;
            promijeniIgraca();
            postaviLinije();
            provjeriKraj();
        }
        else{
            alert('Trokut nije validan, označite ponovo!');
            // undo prethodne radnje jer je neispravan krug
            nacrtajKrug(ctx2, trokut[2].x, trokut[2].y, trokut[2].radius, 'grey');
            trokut[2].color = 'grey';
            trokut[2].blocked = false;
            trokut.pop();
            brojac--;
        }
        /*for(let i=0; i< listalinija.length; i++){
            console.log("1 element ",listalinija[i]);
        }*/
    }
});

function provjeriKlik(krug){
    // provjerava da li je prethodno blokiran
    if(krug.blocked === true ) return false;
    // provjerava da nije tacka na tacku
    if (krug.color === 'grey'){
        return true;
    }
    return false;
}
/*
// ZA OVE FUNKCIJE VISE NEMA POTREBE JER IMAMO FUNKCIJU BLOKIRAJ PRESJECENE KRUGOVE

function blokirajKrugove(krug1,krug2){
    //prvo blokiramo one na istoj liniji ako je x isti ili y isti
    //ovo ce pokriti pravougli trougao
    //vertikalno se poklapaju
    if(krug1.x === krug2.x){
        for(let i=0;i<lista.length;i++){
            const trenutni = lista[i];
            //prvi krug prije drugog selektovan
            if(trenutni.x === krug1.x && krug1.y < trenutni.y && krug2.y > trenutni.y){
                // ovo blocked se naziva dinamicko svojstvo objekta, tj na ovaj nacin mu dodajemo novi atribut i svojstvo true ili false koje mozemo koristiti
                // console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
                trenutni.blocked = true;
            }
            //drugi krug prije prvog selektovan
            if(trenutni.x === krug1.x && krug1.y > trenutni.y && krug2.y < trenutni.y){
                trenutni.blocked = true;
            }
        }
    }
    //horizonalno se poklapaju
    if(krug1.y === krug2.y){
        for(let i=0;i<lista.length;i++){
            const trenutni = lista[i];
            //prvi krug prije drugog selektovan
            if(trenutni.y === krug1.y && krug1.x < trenutni.x && krug2.x > trenutni.x){
                // ovo blocked se naziva dinamicko svojstvo objekta, tj na ovaj nacin mu dodajemo novi atribut i svojstvo true ili false koje mozemo koristiti
                //console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
                trenutni.blocked = true;
            }
            //drugi krug prije prvog selektovan
            if(trenutni.y === krug1.y && krug1.x > trenutni.x && krug2.x < trenutni.x){
                trenutni.blocked = true;
            }
        }
    }

}

// udaljenost centara 2 susjedna kruga po dijagonali = 70
function blokirajDijagonalu(krug1,krug2){
    //uslov da se krugovi nalaze na istoj dijagonali
    if (Math.abs(krug1.x - krug2.x) === Math.abs(krug1.y - krug2.y)) {
    //desna dijagonala ako je prvi kliknut krug1
    let trenutnii = krug1.x;
    let trenutnij = krug1.y;
    //console.log(trenutnii," ",trenutnij)
    for(let i=0;i<lista.length;i++){
        const trenutni = lista[i];
        if(trenutni.x === (trenutnii+70) && trenutni.y === (trenutnij+70) && krug2.x>(trenutnii+70) && krug2.y>(trenutnij+70)){
            //console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
            trenutni.blocked = true;
            trenutnii+=70;
            trenutnij+=70;
        }
    }

    //lijeva dijagonala ako je prvi kliknut krug1
    trenutnii = krug1.x;
    trenutnij = krug1.y;
    //console.log(trenutnii," ",trenutnij)
    for(let i=0;i<lista.length;i++){
        const trenutni = lista[i];
        if(trenutni.x === (trenutnii-70) && trenutni.y === (trenutnij+70) && krug2.x<(trenutnii-70) && krug2.y>(trenutnij+70)){
            //console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
            trenutni.blocked = true;
            trenutnii-=70;
            trenutnij+=70;
        }
    }

    //desna dijagonala ako je prvi kliknut krug2
    trenutnii = krug2.x;
    trenutnij = krug2.y;
    //console.log(trenutnii," ",trenutnij)
    for(let i=0;i<lista.length;i++){
        const trenutni = lista[i];
        if(trenutni.x === (trenutnii+70) && trenutni.y === (trenutnij+70) && krug1.x>(trenutnii+70) && krug1.y>(trenutnij+70)){
            //console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
            trenutni.blocked = true;
            trenutnii+=70;
            trenutnij+=70;
        }
    }

    //lijeva dijagonala ako je prvi kliknut krug2
    trenutnii = krug2.x;
    trenutnij = krug2.y;
    //console.log(trenutnii," ",trenutnij)
    for(let i=0;i<lista.length;i++){
        const trenutni = lista[i];
        if(trenutni.x === (trenutnii-70) && trenutni.y === (trenutnij+70) && krug1.x<(trenutnii-70) && krug1.y>(trenutnij+70)){
            //console.log("Krug blokiran: ", i, " ", trenutni.x, " ",trenutni.y);
            trenutni.blocked = true;
            trenutnii-=70;
            trenutnij+=70;
        }
    }
}
}

*/



//logika da vidimo je li se sijeku jeste da cuvamo prethodno povucene linije i provjeravamo na osnovu toga da li se sijeku

function provjeriPresjek(novaLinija, linije) {
    for (let i=0; i<linije.length;i++) {
        let linija = linije[i];
        //console.log("linija", linija[0]);
        const presjek = jelSeSijeku(novaLinija[0], novaLinija[1], linija[0], linija[1]);
        if (presjek) {
            //console.log("nova linija siječe");
            return true;
        }
    }
    //console.log("nova linija ne siječe");
    return false;
}

// funkcije sa stranice :
// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

function jelSeSijeku(A, B, C, D) { 
    // sve moguce kombinacije za krajnje tacke nasih duzi koje ispitujemo
    const o1 = orijentacija(A, B, C);
    const o2 = orijentacija(A, B, D);
    const o3 = orijentacija(C, D, A);
    const o4 = orijentacija(C, D, B);
    // duzi se sijeku ako tacke c i d imaju razlicitu orijentaciju u odnosu na duz AB 
    // u drugom slucaju, ako a i b imaju razlicitu orijentaciju u odnosu na duz CD
    // ako njihov proizvod daje negativnu vrijednost - razlicite su orijentacije
    return o1 * o2 < 0 && o3 * o4 < 0;
}

function orijentacija(A, B, C) {
    // formula za odredjivanje polozaja 3 tacke u ravni
    return (B.y - A.y) * (C.x - B.x) - (B.x - A.x) * (C.y - B.y);
} 

// ideja za slucaj kada postoji vise krugova ali nemoguce je igrati potez s njima:
// napravimo funkciju odigrajPotez koja ce koristiti gore koriscen uslov, a to je da li je
// moguce povuci ispravnu liniju, ako je nemoguce povuci 3 ispravne linije sa bilo kojim od postojecih 
// slobodnih krugova, return false

function provjeriKraj(){
    //ako ima vise blokiranih i zauzetih krugova nego praznih
    let izbroji=0;
    let izbrojicrne = 0;
    let izbrojibijele = 0;
    let brojaci = [];
    for(let i=0;i<lista.length;i++){
        let trenutni=lista[i];
        if(trenutni.blocked===true) izbroji++;
        else{
            if( trenutni.color === 'grey'){
                brojaci.push(odigrajPotez(trenutni));
            }
        }
        if(trenutni.color === 'black') izbrojicrne++;
        if(trenutni.color === 'white') izbrojibijele++;
    }
    // ne zavrsi ispravno, a nekada zavrsi kada probamo napraviti jos jedan trokut te uracuna i 1 ili 2 tacke neuspjelog trokuta
    while(izbrojicrne % 3 != 0){
        izbrojicrne--;
    }
    while(izbrojibijele % 3 != 0){
        izbrojibijele--;
    }
    let rezultat = lista.length - izbroji;
    console.log("Blokirani: ",izbroji);
    console.log("Crni: ",izbrojicrne);
    console.log("Bijeli: ",izbrojibijele);
    console.log(rezultat);
    let nevalidni = true;
    for( let i=0; i< brojaci.length ; i++){
        if(brojaci[i] > 2 ){
            nevalidni = false;
            break;
        }
    }
    if(rezultat < 3 || nevalidni){
        
        if(!igraPrvi){
            alert("Pobijedio je igrač 2 !");
        }
        else{
            alert("Pobijedio je igrač 1 !");
        }
        if (confirm("Nova igra?")) {
            igraPrviNeMijenjaSeDoKraja = !igraPrviNeMijenjaSeDoKraja;
            igraPrvi = igraPrviNeMijenjaSeDoKraja;
            resetujPlocu();
            
        }
        else{
            alert("Za novu igru potreban reload stranice");
            blokirajSveKrugove();
        }
    }
}

function blokirajSveKrugove(){
    for (let i = 0; i < lista.length; i++) {
        if(lista[i].blocked != false){
            lista[i].blocked=true;
        }
    }

}

function odigrajPotez(krug) {
    let brojac = 0;
    for (let i = 0; i < lista.length; i++) {
        if (lista[i] != krug && lista[i].blocked != true) {
            const validan = provjeriKlik(lista[i]);
            let novalinija = [lista[i], krug];
            let sijecese = false;
            sijecese = provjeriPresjek(novalinija, listalinija);

            if (validan && sijecese === false) {
                brojac++;
                let novitrenutni = lista[i];

                for (let j = 0; j < lista.length; j++) {
                    if (lista[j] != krug && lista[j] != novitrenutni) {
                        const validan = provjeriKlik(lista[j]);
                        let novalinija = [lista[j], novitrenutni];
                        let sijecese = false;
                        sijecese = provjeriPresjek(novalinija, listalinija);

                        if (validan && sijecese === false && lista[j].blocked != true) {
                            brojac++;
                        }
                    }
                }
            }
        }
    }
    //console.log("Broj mogućih povučenih linija je: ", brojac);
    return brojac;
}

// ova funkcija sluzi da blokira krugove koje linija sijece

function blokirajPresjeceneKrugove(linija) {
    //lista krugova
    for (let j = 0; j < lista.length; j++) {
        let krug = lista[j];
        if (presijecaKrug(linija[0],linija[1], krug)) {
            krug.blocked = true;
        }
    }
}
// ova funkcija sluzi da vidimo da li linija sijece CRNI ili BIJELI krug
function prolaziKrozKrug(linija){
    for (let j = 0; j < lista.length; j++) {
        let krug = lista[j];
        if (presijecaKrug(linija[0],linija[1], krug) && krug != linija[0] && krug != linija[1]) {
            if(krug.color === 'white' || krug.color === 'black'){
                console.log("Presjecen je krug broj ",j+1);
                return true;
            }
        }
    }
    return false;
}

// funkcija presijecaKrug je sa stranice :
// https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm


const add = (a, b) => ({x: a.x + b.x, y: a.y + b.y}); // sabira koordinate 2 tacke
const sub = (a, b) => ({x: a.x - b.x, y: a.y - b.y}); // oduzima koordinate 2 tacke
const dot = (a, b) => a.x * b.x + a.y * b.y; // skalarni proizvod 2 vektora
const hypot2 = (a, b) => dot(sub(a, b), sub(a, b)); // pitagorina teorema - kvadrat udaljenost izmedju 2 tacke

// projekcija vektora a na vektor b
function proj(a, b) {
    const k = dot(a, b) / dot(b, b);
    return {x: k * b.x, y: k * b.y};
}


function presijecaKrug(A, B, C) {
    // vektori od tacke a do centra kruga c i vektor od a do b
    const AC = sub(C, A);
    const AB = sub(B, A);
    // tacka d - najbliza tacka duzi AB centru kruga 
    const D = add(proj(AC, AB), A);

    const AD = sub(D, A);
    // sintaksa : uslov ? if_true : if_false
    // pozicija tacke D na duzi AB
    const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

    let distance;
    if (k <= 0.0) {
        distance = Math.sqrt(hypot2(C, A));
    } else if (k >= 1.0) {
        distance = Math.sqrt(hypot2(C, B));
    } else {
        distance = Math.sqrt(hypot2(C, D));
    }
    // da li je udaljenost manja od radijusa - provjera da li sijece krug
    return distance <= C.radius;
}

