//  stringify : form JSON to String
// parse : form string to JSON

class APIFeatures {
    
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        

        // http://localhost:5000?sort=price&limit=12&page=1&price[gte]=900

        // "queryString": {
        //     "sort": "price",
        //     "limit": "12",
        //     "page": "1",
        //     "price": {"gte": "900"}
        // }

        const queryObj = {...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        // "queryObj" : {"price" : "{gte : 900}"}

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // "queryStr" : { "price" : "{$gte : 900}"}
        this.query = this.query.find(JSON.parse(queryStr));

        
        this.queryStr = queryStr;
        return this;
    }

    sort() {
        // http://localhost:3000?sort=price,seaters
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(',', ' ');
            // sortBy = price seaters
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    limitFields() {
        // http://localhost:3000?fields=name,price,speed
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            // fields = name price speed
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        // http://localhost:3000?page=2&limit=12
        if (this.queryString.page) {
            const limit = this.queryString.limit * 1; // 12
            const page = this.queryString.page * 1; // 3
            const skip = (page - 1) * limit; // 12
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    }

}

module.exports = APIFeatures;