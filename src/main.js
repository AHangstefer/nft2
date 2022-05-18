const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { layersOrder, format, rarity } = require("./config.js");

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const Exists = new Map();


const addRarity = _str => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  return itemRarity;
};

const cleanName = _str => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

// going through each image in each layer subfile
const layersSetup = layersOrder => {
  //console.log("layersSetup", layersOrder)
  
  const layers = layersOrder.map((layerObj, index) => ({

    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number
  }));

  return layers;
 
};

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

// building each canvas the correct wxh with edition # next to layer
const saveLayer = (_canvas, _edition) => {

  fs.writeFileSync(`${buildDir}/${_edition}.png`, _canvas.toBuffer("image/png"));
  //console.log("logging saveLayer", _canvas, _edition)
  
};

const addMetadata = _edition => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};



const addAttributes = (_element, _layer) => {
  let tempAttr = {
    //id: _element.id,
    layer: _layer.name,
    //name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

//this is where all images as objects come in as _layer and are added
// on top of eachother for final creations.
// was still having trouble with files with smaller amount of images,
// so I copied and pasted images to add more to files but also added
// if/else statement to adjust index.

const drawLayer = async (_layer, _edition) => {

  let min = 0;
  let max = _layer.elements.length
  console.log("this is max", max)
  let ind = Math.floor(Math.random() * (max-min +1)) + min
   

  let element

  if(!_layer.elements[ind]){
     max = 4
     element = _layer.elements[Math.floor(Math.random() * (max + 1))];
     console.log("changed element")
    }
  else{
    element = _layer.elements[ind]
    console.log("same ol element")
  }
  
  console.log("this is element", element)
 
  
 
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);
   
      ctx.drawImage(
        image,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
      );
      saveLayer(canvas, _edition);
    
  
  
};

const createFiles = async edition => {
  const layers = layersSetup(layersOrder);
  let numDupes = 0;
 for (let i = 1; i <= edition; i++) {
  await layers.forEach(async (layer) => {
        await drawLayer(layer, i);
      
      });
  
  

   let key = hash.toString();
   if (Exists.has(key)) {
     console.log(
       `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
         key
       )}`
     );
     numDupes++;
     if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
     i--;
   } else {
     Exists.set(key, i);
     addMetadata(i);
     console.log("Creating edition " + i);
   }
 }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if(err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
        console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData };