import data from './../database/data.json'
import FluentSQLBuilder from './fluentSQL.js'

const result = FluentSQLBuilder.for(data)
    // ou inicia com 2020 ou com 2019
    .where({ registered: /^(2020|2019)/ })

    // ou security ou developer ou quality assurance, 
    // ^-> deve começar
    // $ - deve terminar a string
    .where({ category: /^(security|developer|quality assurance)$/ })

    // ou o DDD é 852 ou 850 ou 810
    .where({ phone: /\((852|850|810)\)/ })
    .select(['name', 'company', 'phone', 'category', 'registered'])
    .orderBy('category')
    .limit(2)
    .build()


console.table(result)