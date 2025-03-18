import { Query, Document } from 'mongoose'; // Importowanie Query i Document z Mongoose

interface QueryString {
    sort?: string;
    page?: string;
    limit?: string;
    fields?: string;
}

class APIFeatures<T extends Document> {
    public query: Query<any, T>; // Ogólne typowanie dla zapytania Mongoose
    public queryString: QueryString; // Parametry zapytania URL

    constructor(query: Query<T[], T>, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Sortowanie wyników
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    // Paginacja wyników
    paginate() {
        const page = this.queryString.page ? parseInt(this.queryString.page, 10) : 1;
        const limit = this.queryString.limit ? parseInt(this.queryString.limit, 10) : 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    // Ograniczenie pól w odpowiedzi
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this;
    }

    lean() {
        this.query = this.query.lean();
        return this;
    }
}

export default APIFeatures;
