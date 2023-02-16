const cheerio = require("cheerio");
const axios = require("axios");
const js2csv = require("json2csv").Parser;
const fs = require("fs")
const judul = "https://books.toscrape.com/catalogue/category/books/fiction_10/index.html";
const paginate = "https://books.toscrape.com/catalogue/category/books/fiction_10/";
const book_data = []

async function getJudul(url) {
    try {
        const response = await axios.get(url);
        const a = cheerio.load(response.data)
        // const genre = a("h1").text();
        // console.log(genre);
        const books = a("article");
        books.each(function(){
            title = a(this).find("h3").text();
            price = a(this).find(".price_color").text();
            stock = a(this).find(".availability").text().trim();

            book_data.push({title,price,stock})
        });
        if (a(".next a").length > 0){
            next_page = paginate + a(".next a").attr("href");
            getJudul(next_page);
        }
        else {
            const parser = new js2csv();
            const csv = parser.parse(book_data);
            fs.writeFileSync("./webscrapping.csv",csv);
        }
        console.log(book_data);
    } catch (error) {
        console.error(error)
    }
}

getJudul(judul);