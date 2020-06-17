var database;
var drawing = [];

function setup(){
    createCanvas(500,500);
    database = firebase.database();
    
    var params = getURLParams();
    console.log(params);
    if(params.id){
        showDrawing(params.id);
    }
}

function draw(){
    background(255);
    //readPosition();
    beginShape();
    stroke(0);
    strokeWeight(3);
    noFill();
    for(var i=0;i<drawing.length;i++){
        vertex(drawing[i].x,drawing[i].y);
        endShape()
    }
}

//function readPosition(){
//    database.ref('drawing/d').on('value', function(data){
//        drawing = data.val()
//    })
//}

function mouseDragged() {
    var point = {x:mouseX, y:mouseY}
    drawing.push(point);

    //var databaseref = database.ref('drawing');
    //databaseref.set({"d": drawing});

    var saveButton = createButton("SAVE");
    saveButton.position(510,260);

    var clearButton = createButton("CLEAR");
    clearButton.position(510,290);
    
    saveButton.mousePressed(()=> {
    var ref = database.ref('drawing');
    ref.on('value',gotData);

    var store ={name:"Radhashree's Drawings", drawing:drawing}
    ref.push(store);
  })

    clearButton.mousePressed(()=>{
        drawing = [];
    })
}

function gotData(data){
    var elts = selectAll('.listing');
    for(var t=0; t<elts.length; t++){
        elts[t].remove();
    }

    var drawings = data.val();
    var keys = Object.keys(drawings);
    for(var k=0; k<keys.length; k++){
        var key = keys[k];
        var li = createElement('li','');
        li.class('listing');
        var aref = createA('#', key);
        aref.mousePressed(showDrawing);
        aref.parent(li);

        var link = createA('?id='+ key, 'link');
        link.parent(li);
        link.style('padding','4px');
    }
}

function showDrawing(key){
    if(key instanceof MouseEvent){
        key = this.html();
    }
    var key = this.html();
    var ref = database.ref('drawing/'+ key);
    ref.once('value', oneDrawing);

    function oneDrawing(data){
        var newdrawing = data.val();
        drawing = newdrawing.drawing
    }
}