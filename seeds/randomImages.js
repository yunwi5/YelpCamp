const { hasDuplicates, getRandomNumber } = require('../utils/generalUtils');

/* 
 {
    url:
        "https://res.cloudinary.com/diglbnk1i/image/upload/v1646577070/YelpCamp/dvamxvdwirgc60jzlp6z.jpg",
    filename: "YelpCamp/dvamxvdwirgc60jzlp6z"
},
*/
const randomImgArray = [
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646580005/YelpCamp/kkuhvywb3euvpmizlgsb.jpg",
        filename: "YelpCamp/kkuhvywb3euvpmizlgsb"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646580099/YelpCamp/lx6m3pgskt9qeli8oslf.jpg",
        filename: 'YelpCamp/lx6m3pgskt9qeli8oslf'
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646580292/YelpCamp/i4ergnr66qq0cqb2lkvv.jpg",
        filename: "YelpCamp/i4ergnr66qq0cqb2lkvv"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646580309/YelpCamp/zvhnxe7rwwkmtwyybra6.jpg",
        filename: "YelpCamp/zvhnxe7rwwkmtwyybra6"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646581137/YelpCamp/ufhce84lzsdxrdgxh8si.jpg",
        filename: "YelpCamp/ufhce84lzsdxrdgxh8si"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646581289/YelpCamp/bxgppypspfvwcdjwwngf.jpg",
        filename: "YelpCamp/bxgppypspfvwcdjwwngf"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646583736/YelpCamp/keqcxeiyk63lgtl26y0o.jpg",
        filename: "YelpCamp/keqcxeiyk63lgtl26y0o"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646637140/YelpCamp/sctjgdrapunvflieu8xz.jpg",
        filename: "YelpCamp/sctjgdrapunvflieu8xz"
    },
    {
        url: "https://res.cloudinary.com/diglbnk1i/image/upload/v1646637276/YelpCamp/kdeshxzixfjyjnp5mgql.jpg",
        filename: "YelpCamp/kdeshxzixfjyjnp5mgql"
    }
]

function getRandomImages() {
    const numImages = getRandomNumber(3, 5); // 3 to 5 campgrounds images

    const imgArr = [];
    const indexSet = new Set();
    while (imgArr.length < numImages) {
        let randomIndex = getRandomNumber(0, randomImgArray.length - 1);
        while (indexSet.has(randomIndex)) {
            randomIndex = getRandomNumber(0, randomImgArray.length - 1);
        }
        indexSet.add(randomIndex);
        const imgLink = randomImgArray[randomIndex];
        imgArr.push(imgLink);
    }

    return imgArr;
}

function getExampleImages(num = 30) {
    for (let i = 0; i < num; i++) {
        const images = getRandomImages();
        if (hasDuplicates(images)) {
            console.error('No, img array should not have duplicates');
        }
        console.log(images);
    }
}

module.exports = {
    getRandomImages
}