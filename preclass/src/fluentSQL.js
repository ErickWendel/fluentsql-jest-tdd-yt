export default class FluentSQLBuilder {
    #data = []
    #limit = 0
    #select = []
    #where = []
    #orderBy = ''

    constructor({ database }) {
        this.#data = database

    }

    static for(database) {
        return new FluentSQLBuilder({ database })
    }


    limit(max) {
        this.#limit = max

        return this;
    }


    select(props) {
        this.#select = props

        return this;
    }

    where(query) {

        const [[prop, selectValue]] = Object.entries(query)
        const whereFilter = selectValue instanceof RegExp ?
            selectValue :
            new RegExp(selectValue)

        this.#where.push({ prop, filter: whereFilter })

        return this;
    }

    orderBy(field) {
        this.#orderBy = field

        return this;

    }
    
    #performWhere(item) {
        for (const { filter, prop } of this.#where) {
            if (!filter.test(item[prop])) return false;
        }

        return true
    }

    #performSelect(item) {
        const currentItem = {}
        const values = Object.entries(item)
        for (const [key, value] of values) {
            if (this.#select.length && !this.#select.includes(key)) continue;

            currentItem[key] = value
        }
        return currentItem
    }

    #performLimit(result) {
        return this.#limit && result.length === this.#limit
    }

    #performOrderBy(projection) {
        if (!this.#orderBy) return projection

        return projection.sort((prev, next) => {
            return prev[this.#orderBy].localeCompare(next[this.#orderBy])
        })
    }

    build() {
        const result = []

        for (const item of this.#data) {
            if (!this.#performWhere(item)) continue
            const currentItem = this.#performSelect(item)
            result.push(currentItem)

            if (this.#performLimit(result)) break;
        }
        const finalResult = this.#performOrderBy(result)
        return finalResult

    }
}

