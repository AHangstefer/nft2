const layersOrder = [
    {name:'background', number:0},
    {name:'swirl', number:1},
    {name:'roundOne', number:2},
    {name:'bigSwiggle', number:3},
    {name:'middleRound', number:4},
    {name:'topLevelSquig', number:5},
    {name:'slit', number:6},
    {name:'top', number:7}
   ];
  
const format = {
    width: 2000,
    height: 2000
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 400;

module.exports = { layersOrder, format, rarity, defaultEdition };



// const fs = require("fs");
// const width = 2000;
// const height = 2000;
// const dir = __dirname;
// const rarity = [
//     {key: "", val: "original"},
//     {key:"_r", val: "rare"},
//     {key:"_sr", val: "super rare"}
// ];

// const addRarity = (_str) => {
//     let itemRarity;
//     rarity.forEach((r)=> {
//         if(_str.includes(r.key)){
//             itemRarity = r.val;
//         }
//     });
//     return itemRarity;

// };

// const cleanName = (_str) => {
//     let name = _str.slice(0, -4);
//     rarity.forEach((r) => {
//         name = name.replace(r.key, "");
//     });
//     return name;
// };

// const getElement = (path) => {
//     return fs
//         .readdirSync(path)
//         .filter((item)=> !/(^|\?)\.[^\/\.]/g.test(item))
//         .map((i, index)=> {
//             return{
//                 id: index + 1,
//                 name: cleanName(i),
//                 fileName: i,
//                 rarity: addRarity(i),
//             };
//         });
// };

// const layers = [
//     {
//         id: 1,
//         name: "background",
//         locaiton: `${dir}/background/`,
//         elements: getElements(`${dir}/background/`),
//         position: { x: 0, y: 0},
//         size: {width: width, height: height}
//     },

//     {
//         id: 2,
//         name: "swirl",
//         locaiton: `${dir}/swirl/`,
//         elements: getElements(`${dir}/swirl/`),
//         position: { x: 0, y: 0},
//         size: {width: width, height: height}


//     },

//     {
//         id: 3,
//         name: "roundOne",
//         locaiton: `${dir}/roundOne/`,
//         elements: getElements(`${dir}/roundOne/`),
//         position: { x: 0, y: 0},
//         size: {width: width, height: height}


//     };


// ];

// moduel.exports = {layers, width, height};



