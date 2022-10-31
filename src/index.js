import data from './../database/data.json' assert { type: 'json' };
import of from './fluentSQL.js';

const result = of(data)
    .where({ registered: /^(2020|2019)/ })
    .where({ category: /^(security|developer|quality assurance)$/ })
    .where({ phone: /\((852|890|810)\)/ })
    .select(['name', 'company', 'phone', 'category', 'registered'])
    .orderBy('category')
    .limit(2)
    .groupBy('category')
    .build();

console.log(result);
