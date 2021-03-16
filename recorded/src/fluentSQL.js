export default class FluentSQLBuilder {
    #database = []
    #limit = 0
    #select = []
    #where = []
    #orderBy = ''

    constructor({ database }) {
        this.#database = database
    }

    static for(database) {
        return new FluentSQLBuilder({ database })
    }
    limit(max) {
        this.#limit = max

        return this
    }
    select(props) {
        this.#select = props

        return this
    }

    where(query) {
        // {category: 'developer'}
        // {category: /dev/}


        const [[prop, selectedValue]] = Object.entries(query)
        const whereFilter = selectedValue instanceof RegExp ?
            selectedValue :
            new RegExp(selectedValue)

        /*
        [
            [category, 'developer']
        ]
        */

        this.#where.push({ prop, filter: whereFilter})

        return this
    }

    orderBy(field) {
        this.#orderBy = field
        
        return this
    }
    #performLimit(results) {
        return this.#limit && results.length === this.#limit
    }

    #performWhere(item) {
        for( const { filter, prop} of this.#where) {
            if(!filter.test(item[prop])) return false
        }

        return true
    }
    #performSelect(item) { 
        const currentItem = {}
        const entries = Object.entries(item)
        for(const [ key, value] of entries) {
            if(this.#select.length && !this.#select.includes(key)) continue

            currentItem[key] = value
        }

        return currentItem
    }
    #performOrderBy(results) { 
        
        if(!this.#orderBy) return results

        return results.sort((prev, next) => {
            return prev[this.#orderBy].localeCompare(next[this.#orderBy])
        })

    }   

    build() {
        const results = []
        for (const item of this.#database) {
            if (!this.#performWhere(item)) continue;

            const currentItem = this.#performSelect(item)
            results.push(currentItem)

            if (this.#performLimit(results)) break;

        }
        

        const finalResult = this.#performOrderBy(results)
        return finalResult
    }

}