export default class ApiFeatures {
    public pagination: any = {};
    constructor(private query, public mongooseQuery) { }
    filter() {
        // Query parameters that should not be used as MongoDB filter conditions.
        // These parameters have their own purposes, such as pagination and sorting.
        const excludeQuery = ["limit", "page", "sort", "fields", "keyword"];

        // Create a copy of the query parameters to avoid modifying the original object.
        let filter = { ...this.query };

        // Remove the excluded parameters from the filter object.
        excludeQuery.forEach((ele) => {
            delete filter[ele];
        });

        // Convert the filter object into a JSON string.
        // This allows us to replace operators such as gte, gt, lte, and lt.
        let filterStr = JSON.stringify(filter);

        // Replace comparison operators with their MongoDB equivalents:
        // gte -> $gte (greater than or equal to)
        // gt  -> $gt  (greater than)
        // lte -> $lte (less than or equal to)
        // lt  -> $lt  (less than)
        //
        // The \b represents a word boundary, ensuring that we match
        // complete operator names rather than parts of other words.
        filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (value) => {
            return `$${value}`;
        });

        // Convert the modified JSON string back into a JavaScript object.
        // This object can now be used as a MongoDB filter.
        filter = JSON.parse(filterStr);

        // Apply the filter conditions to the Mongoose query.
        this.mongooseQuery = this.mongooseQuery.find(filter);

        // Return the current ApiFeatures instance to allow method chaining.
        return this;
    }
    sort() {
        // Check if the user provided a sort parameter in the URL.
        // For example: ?sort=price or ?sort=price,-ratingsAverage
        if (this.query.sort) {

            // Get the sort parameter as a string.
            // The "as string" is a TypeScript type assertion that tells
            // TypeScript to treat this value as a string.
            let sortStr = this.query.sort as string;

            // Replace commas with spaces because Mongoose expects
            // space-separated field names when sorting by multiple fields.
            //
            // Example:
            // "price,-ratingsAverage"
            // becomes:
            // "price -ratingsAverage"
            //
            // A field without "-" is sorted in ascending order.
            // A field starting with "-" is sorted in descending order.
            sortStr = sortStr.split(",").join(" ");

            // Apply the sorting criteria to the Mongoose query.
            // The query will sort the results according to the specified fields.
            this.mongooseQuery = this.mongooseQuery.sort(sortStr);
        }

        // Return the current ApiFeatures instance to allow method chaining.
        return this;
    }

    fields() {
        // Check whether the user specified which fields they want
        // to retrieve from the database through the "fields" query parameter.
        //
        // Example URL:
        // GET /api/products?fields=title,price,ratingsAverage
        if (this.query.fields) {

            // Get the requested fields as a string.
            // "as string" is a TypeScript type assertion that tells
            // TypeScript to treat this value as a string.
            let fieldStr = this.query.fields as string;

            // Replace commas with spaces because Mongoose's select()
            // method accepts space-separated field names.
            //
            // Example:
            // "title,price,ratingsAverage"
            // becomes:
            // "title price ratingsAverage"
            fieldStr = fieldStr.split(",").join(" ");

            // Tell Mongoose to return only the fields specified by the user.
            // This is called field selection or projection.
            //
            // Example:
            // .select("title price ratingsAverage")
            // returns only these fields, along with _id by default.
            this.mongooseQuery = this.mongooseQuery.select(fieldStr);

        } else {

            // If the user did not specify any fields, return all fields
            // by default, except for "__v".
            //
            // "__v" is a version key that Mongoose adds to documents
            // by default. The "-" prefix means to exclude this field.
            //
            // Example:
            // .select("-__v")
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }

        // Return the current ApiFeatures instance to allow method chaining
        // with other methods, such as filter(), sort(), and paginate().
        return this;
    }
    search(model?) {
        // Check whether the user provided a keyword in the URL.
        // Example: GET /api/products?keyword=laptop
        if (this.query.keyword) {

            // Create an empty object that will contain the search conditions.
            // "any" allows us to add different properties to this object
            // without TypeScript complaining about its structure.
            let searchFilter: any = {};

            // Check whether we are searching through products.
            // The "model" parameter determines which fields to search in.
            if (model == "Product" || model == "Review") {

                // Use MongoDB's $or operator to search in multiple fields.
                // A product matches if its title OR its description
                // contains the provided keyword.
                searchFilter.$or = [

                    // Search for the keyword inside the product's title.
                    {
                        title: {
                            // $regex performs a pattern match against the field.
                            // The keyword is used as the search pattern.
                            $regex: this.query.keyword,

                            // The "i" option makes the search case-insensitive.
                            // For example, "laptop" matches "Laptop" and "LAPTOP".
                            $options: "i"
                        }
                    },

                    // Search for the keyword inside the product's description.
                    {
                        description: {
                            $regex: this.query.keyword,
                            $options: "i"
                        }
                    }
                ];

            } else {

                // If the model is not "product", search only in the "name" field.
                // This can be useful for models such as Category or User.
                //
                // Example:
                // GET /api/categories?keyword=electronics
                //
                // MongoDB will search for "electronics" in the name field,
                // ignoring uppercase and lowercase differences.
                searchFilter = {
                    name: {
                        $regex: this.query.keyword,
                        $options: "i"
                    }
                };
            }

            // Apply the search conditions to the existing Mongoose query.
            // This adds the keyword search to the query being built.
            this.mongooseQuery = this.mongooseQuery.find(searchFilter);
        }

        // Return the current ApiFeatures instance to allow method chaining.
        return this;
    }
    paginate(documentsCount) {
        // Get the requested page number from the URL.
        // Convert it from a string to a number.
        // If the user doesn't provide a page number or provides an invalid
        // number such as 0 or NaN, default to page 1.
        //
        // Example: ?page=2
        this.pagination.page = Number(this.query.page) || 1;

        // Get the number of documents to return per page.
        // Convert the limit from a string to a number.
        // If the user doesn't provide a limit or provides an invalid
        // number such as 0 or NaN, default to 5 documents per page.
        //
        // Example: ?limit=10
        const limit = Number(this.query.limit) || 5;

        // Calculate the total number of pages required to display
        // all documents using the specified limit.
        //
        // Math.ceil() rounds the result up because even a partially
        // filled page counts as a complete page.
        //
        // Example:
        // documentsCount = 12, limit = 5
        // numberOfPages = Math.ceil(12 / 5) = 3
        this.pagination.numberOfPages = Math.ceil(documentsCount / limit);

        // Calculate how many documents to skip before retrieving
        // the documents for the requested page.
        //
        // Page 1: skip = (1 - 1) * 5 = 0
        // Page 2: skip = (2 - 1) * 5 = 5
        // Page 3: skip = (3 - 1) * 5 = 10
        //
        // This tells MongoDB where the requested page begins.
        const skip = (this.pagination.page - 1) * limit;

        // Calculate the index immediately after the last document
        // that would belong to the current page.
        //
        // Example:
        // Page 1, limit 5: endIndex = 1 * 5 = 5
        // Page 2, limit 5: endIndex = 2 * 5 = 10
        const endIndex = this.pagination.page * limit;

        // Check whether there are more documents after the current page.
        // If endIndex is smaller than the total document count,
        // another page is available.
        if (endIndex < documentsCount) {

            // Store the next page number in the pagination object.
            // For example, if the current page is 1, the next page is 2.
            this.pagination.nextPage = this.pagination.page + 1;
        }

        // Check whether the current page is greater than page 1.
        // If skip is greater than 0, there are documents before
        // the current page, so a previous page may be available.
        if (skip > 0) {

            // Store the previous page number in the pagination object.
            // For example, if the current page is 3, the previous page is 2.
            this.pagination.prevPage = this.pagination.page - 1;
        }

        // Apply pagination to the Mongoose query.
        //
        // skip(skip): skips the documents belonging to earlier pages.
        // limit(limit): restricts the number of returned documents.
        //
        // Example:
        // Page 2 with a limit of 5:
        // .skip(5).limit(5)
        //
        // This retrieves documents 6–10, assuming a stable sort order.
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        // Return the current ApiFeatures instance to allow method chaining.
        return this;
    }
}