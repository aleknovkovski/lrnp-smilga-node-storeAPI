const Product = require('../models/product');

async function getAllProductsStatic (req, res) {
    const products = await Product.find({})
    res.status(200).json({message: 'products testing route', products});
}

const propLogic = (prop, value) => {
    switch(prop) {
        case 'name': return {$regex: value, $options: 'i'};
        default: return value;
    }
}

function numericFilters(initialQueryObject, numericFilters) {
    const queryObject = {...initialQueryObject}
    const operators = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
        regEx, (match) => `-${operators[match]}-`
    );

    const options = ['price', 'rating'];
    filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
        }
    });
    return queryObject;
}

function queryObject(query) {
    let queryObject = {}
    Object.keys(query).map(prop => {
        const value = query[prop]
        value ? queryObject[prop] = propLogic(prop, value) : null;
    })

    if(query.numericFilters) {
        queryObject = numericFilters(queryObject, query.numericFilters)
    }

    return queryObject
}

const splitString = (sort) => {
    return sort.split(',').join(' ');
}

async function getAllProducts (req, res) {
    const {query} = req; const {sort, fields} = query;

    let results = Product.find(queryObject(query));
    sort ? results = results.sort(splitString(sort)) : null;
    fields ? results = results.select(splitString(fields)) : null;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    results = results.skip(skip).limit(limit);

    const products = await results

    res.status(200).json({message: 'products route', products})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}