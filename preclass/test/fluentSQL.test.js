import { expect, describe } from '@jest/globals';
import FluentSQLBuilder from '../src/fluentSQL.js';

const data = [
  {
    id: 0,
    name: 'erick',
    category: 'developer'
  },
  {
    id: 1,
    name: 'mariazinha',
    category: 'developer'
  },
  {
    id: 2,
    name: 'joaozin',
    category: 'manager',
  },
]

describe('FluentSQL Suite Test OnDemand', () => {

  test('#for should return a FluentSQLBuilder instance', () => {
    const result = FluentSQLBuilder.for(data) 
    const instance = new FluentSQLBuilder({ database: data })
    expect(result).toStrictEqual(instance)
  })


  test('#build should return the empty object instance', () => {
    const result = FluentSQLBuilder.for(data).build()
    expect(result).toStrictEqual(data)
  })

  test('#limit given a collection it should limit results', () => {
    const result = FluentSQLBuilder.for(data) .limit(1).build()
    const expected = [data[0]]

    expect(result).toStrictEqual(expected) 
  });


  test('#where given a collection it should filter data', () => {
    const result = FluentSQLBuilder.for(data).where({ category: /^dev/ }).build()
    const expected = data.filter(({ category }) => category.slice(0, 3) === 'dev')

    expect(result).toStrictEqual(expected)
  });

  test('#select given a collection it should return only specific fields', () => {
    const result = FluentSQLBuilder.for(data).select(['name', 'category']).build()
    const expected = data.map(({ name, category }) => ({ name, category }))

    expect(result).toStrictEqual(expected)

  });

  test('#orderBy given a collection it should order results by field', () => {
    const result = FluentSQLBuilder.for(data).orderBy('name').build()
    const expected = [
      {
        id: 0,
        name: 'erick',
        category: 'developer'
      },
      {
        id: 2,
        name: 'joaozin',
        category: 'manager',
      },
      {
        id: 1,
        name: 'mariazinha',
        category: 'developer'
      },
    ]

    expect(result).toStrictEqual(expected)
  });
  

  test('pipeline', () => {
    const result = FluentSQLBuilder.for(data)
      .limit(3)
      // especificamente developer
      .where({ category: "developer" })
      // contem m
      .where({ name: /m/ })
      .select(['name', 'id'])
      // nao vai fazer diferença pq só vai ter 1
      .orderBy('id')
      .build()

    const expected = data.filter(({ id }) => id === 1).map(({ name, id }) => ({ name, id }))
    expect(result).toStrictEqual(expected)


  })

})

