export default class ApiFeatures {
    public pagination: any = {};
    constructor(private query, public mongooseQuery) { }
    filter() {
        const excludeQuery = ["limit", "page", "sort", "fields", "keyword"];
        let filter = { ...this.query };
        excludeQuery.forEach((ele) => { delete filter[ele] });
        let filterStr = JSON.stringify(filter);
        filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (value) => `$${value}`);
        filter = JSON.parse(filterStr);
        this.mongooseQuery = this.mongooseQuery.find(filter);
        return this;
    }
    sort() {
        if (this.query.sort) {
            let sortStr = this.query.sort as string;
            sortStr = sortStr.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortStr);
        }
        return this;
    }

    fields() {
        if (this.query.fields) {
            let fieldStr = this.query.fields as string;
            fieldStr = fieldStr.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fieldStr);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }
    search(model?) {
        if (this.query.keyword) {
            let searchFilter: any = {};
            if (model == "product") {
                searchFilter.$or = [{ title: { $regex: this.query.keyword, $options: "i" } }, { description: { $regex: this.query.keyword, $options: "i" } }];
            } else {
                searchFilter = { name: { $regex: this.query.keyword, $options: "i" } };
            }
            this.mongooseQuery = this.mongooseQuery.find(searchFilter);
        }
        return this
    }
    paginate(documentsCount) {
        this.pagination.page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        this.pagination.numberOfPages = Math.ceil(documentsCount / limit);
        const skip = (this.pagination.page - 1) * limit;
        const endIndex = this.pagination.page * limit

        if (endIndex < documentsCount) {
            this.pagination.nextPage = this.pagination.page + 1;
        }
        if (skip > 0) {
            this.pagination.prevPage = this.pagination.page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this
    }
}